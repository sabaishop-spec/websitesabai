import React, { useState, useEffect } from 'react';
import { knowledgeAPI, KnowledgeItem } from '../lib/knowledgeAPI';
import { Plus, Trash2, Pencil, ExternalLink, RefreshCw, Save, CheckCircle2, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { compressImage } from '../lib/imageUtils';
import type QuillType from 'quill';
import 'quill/dist/quill.snow.css';

// --- Local Storage Sync Logic ---
const syncOldLocalData = async () => {
    try {
        const rawBlog = localStorage.getItem('localDB_data_blogPosts');
        if (rawBlog) {
            const oldData = JSON.parse(rawBlog);
            if (oldData && oldData.length > 0) {
                await knowledgeAPI.syncLocalData(oldData);
                // Clear after successful sync
                localStorage.removeItem('localDB_data_blogPosts');
                console.log('Synced old local data to Supabase!');
            }
        }
    } catch (err) {
        console.error('Failed to sync old local data:', err);
    }
};

export default function AdminKnowledgeManager() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<KnowledgeItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await syncOldLocalData();
      const data = await knowledgeAPI.fetchItems();
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Lỗi khi tải dữ liệu từ database: ' + (err.message || 'Không rõ nguyên nhân'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: KnowledgeItem) => {
    setEditingItem({ ...item });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleCreateNew = () => {
    const newOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index ?? 0)) + 1 : 0;
    setEditingItem({
      id: '',
      title: '',
      type: 'article',
      link: '',
      content: '',
      is_active: true,
      order_index: newOrder,
    });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.title) {
        setErrorMsg('Vui lòng nhập tên mục');
        return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingItem.id) {
        // Update
        await knowledgeAPI.updateItem(editingItem.id, editingItem);
      } else {
        // Create
        const idToSave = crypto.randomUUID();
        await knowledgeAPI.createItem({ ...editingItem, id: idToSave });
      }
      setSuccessMsg('Đã lưu thành công vào Supabase!');
      setEditingItem(null);
      await fetchItems(); // Refetch from DB to ensure sync
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMsg('Lỗi lưu dữ liệu: ' + (err.message || 'Không thể lưu vào Supabase. Kiểm tra lại kết nối.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục này vĩnh viễn khỏi Database?')) return;
    setLoading(true);
    try {
      await knowledgeAPI.deleteItem(id);
      await fetchItems(); // Refetch ensuring cache invalidation
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Lỗi khi xóa: ' + err.message);
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await knowledgeAPI.updateItem(id, { is_active: !currentStatus });
      setItems(items.map(i => i.id === id ? { ...i, is_active: !currentStatus } : i));
    } catch(err: any) {
      alert("Lỗi cập nhật trạng thái: " + err.message);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;
    
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[swapIndex];
    newItems[swapIndex] = temp;
    
    // Assign definitive order to both
    const updatedItems = newItems.map((item, idx) => ({ ...item, order_index: idx }));
    setItems(updatedItems); // Optimistic UI update

    try {
       await Promise.all(updatedItems.map(item => 
          knowledgeAPI.updateItem(item.id, { order_index: item.order_index })
       ));
    } catch (err: any) {
       console.error(err);
       alert("Lỗi khi cập nhật thứ tự: " + err.message);
       fetchItems(); // revert on failure
    }
  };

  if (editingItem) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {editingItem.id ? 'Chỉnh sửa Mục' : 'Thêm Mục Mới'}
          </h2>
          <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-800">
            Hủy / Quay lại
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 flex items-center gap-2 rounded border border-red-200">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tên mục (Title) *</label>
                <input 
                  type="text" 
                  value={editingItem.title || ''} 
                  onChange={e => setEditingItem({...editingItem, title: e.target.value})} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Loại (Type)</label>
                <select 
                  value={editingItem.type || 'article'} 
                  onChange={e => setEditingItem({...editingItem, type: e.target.value})} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                   <option value="article">Bài viết (Article)</option>
                   <option value="external_link">Liên kết ngoài (External Link)</option>
                   <option value="pdf">Tài liệu PDF</option>
                   <option value="video">Video</option>
                </select>
             </div>
          </div>

          {editingItem.type === 'external_link' || editingItem.type === 'pdf' || editingItem.type === 'video' ? (
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Đường dẫn liên kết (Link)</label>
                <input 
                  type="url" 
                  value={editingItem.link || ''} 
                  onChange={e => setEditingItem({...editingItem, link: e.target.value})} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="https://..."
                />
             </div>
          ) : (
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung / Text (Content)</label>
                <textarea 
                  value={editingItem.content || ''} 
                  onChange={e => setEditingItem({...editingItem, content: e.target.value})} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500 h-40" 
                  placeholder="Nhập nội dung bài viết vào đây..."
                />
                <p className="text-xs text-gray-500 mt-1">Dữ liệu thực tế ghi trực tiếp vào Supabase text fields.</p>
             </div>
          )}

          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded border border-gray-200">
             <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActiveToggle" 
                  checked={editingItem.is_active} 
                  onChange={e => setEditingItem({...editingItem, is_active: e.target.checked})} 
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="font-bold cursor-pointer select-none">Bật hiển thị (is_active)</label>
             </div>
             
             <div className="flex items-center gap-2 border-l border-gray-300 pl-6">
                <label className="font-bold">Thứ tự ưu tiên (order_index):</label>
                <input 
                  type="number" 
                  value={editingItem.order_index ?? 0} 
                  onChange={e => setEditingItem({...editingItem, order_index: parseInt(e.target.value) || 0})} 
                  className="w-20 border border-gray-300 p-1.5 rounded text-center" 
                />
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
             <button type="button" onClick={() => setEditingItem(null)} className="px-6 py-2 border rounded text-gray-700 font-medium hover:bg-gray-50">
               Hủy bỏ
             </button>
             <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded font-medium shadow flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 min-w-[140px]">
               {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
               {saving ? 'Đang lưu...' : 'Lưu vào Database'}
             </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
           <h2 className="text-xl font-bold font-sans text-gray-800 flex items-center gap-2">
               Quản lý Góc Kiến Thức
           </h2>
           <p className="text-sm text-gray-500 mt-1">Kết nối trực tiếp Supabase Database. Nguồn dữ liệu duy nhất.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={fetchItems} disabled={loading} className="p-2 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50">
              <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
           </button>
           <button onClick={handleCreateNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
             <Plus size={18} /> Thêm Mục Mới
           </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 flex items-center gap-2 rounded-lg border border-green-200 shadow-sm">
           <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 flex items-center gap-2 rounded-lg border border-red-200 shadow-sm">
           <AlertCircle size={20} /> {errorMsg}
           <button onClick={fetchItems} className="ml-auto underline font-medium">Thử lại</button>
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden rounded-lg">
        {loading ? (
           <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <RefreshCw className="animate-spin mb-3 text-blue-500" size={32} />
              <p>Đang đồng bộ dữ liệu từ Supabase...</p>
           </div>
        ) : items.length === 0 ? (
           <div className="p-12 text-center text-gray-500">
              <Database className="mx-auto mb-3 opacity-30" size={48} />
              <p className="mb-4">Chưa có dữ liệu trong Database.</p>
              <button onClick={handleCreateNew} className="text-blue-600 font-medium hover:underline">Hãy thêm mục đầu tiên</button>
           </div>
        ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                      <th className="p-4 font-semibold text-gray-700 w-16 text-center">Thứ tự</th>
                      <th className="p-4 font-semibold text-gray-700">Tên mục</th>
                      <th className="p-4 font-semibold text-gray-700 text-center w-32">Loại</th>
                      <th className="p-4 font-semibold text-gray-700 text-center w-32">Trạng thái</th>
                      <th className="p-4 font-semibold text-gray-700 text-right w-32">Thao tác</th>
                   </tr>
                </thead>
                <tbody>
                   {items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                         <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100">
                               <button onClick={() => handleMove(index, 'up')} disabled={index===0} className="disabled:opacity-20 hover:text-blue-600 p-1"><ArrowUp size={14}/></button>
                               <span className="text-xs font-bold w-4">{item.order_index}</span>
                               <button onClick={() => handleMove(index, 'down')} disabled={index===items.length-1} className="disabled:opacity-20 hover:text-blue-600 p-1"><ArrowDown size={14}/></button>
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                            {item.link ? (
                               <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                  {item.link} <ExternalLink size={10} />
                               </a>
                            ) : (
                               <div className="text-xs text-gray-500 line-clamp-1">{item.content ? item.content.substring(0,60)+'...' : '(Chưa có nội dung)'}</div>
                            )}
                         </td>
                         <td className="p-4 text-center">
                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-700 uppercase tracking-wide">
                               {item.type}
                            </span>
                         </td>
                         <td className="p-4 text-center">
                             <button 
                                onClick={() => handleToggleActive(item.id, item.is_active)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${item.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                             >
                                {item.is_active ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                             </button>
                         </td>
                         <td className="p-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition"><Pencil size={16}/></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"><Trash2 size={16}/></button>
                             </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        )}
      </div>
    </div>
  );
}
