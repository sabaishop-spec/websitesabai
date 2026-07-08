import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Check, X, Image as ImageIcon, Settings, Eye, Globe, RotateCcw, Pencil, Search } from 'lucide-react';

const BlogCategoriesManager = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCat, setEditingCat] = useState<any>(null);

  const fetchCats = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase.from('blogCategories').select('*');
        if (!error && data && data.length > 0) {
            setCategories(data);
        } else {
            setCategories([
              { id: '1', name: 'Kiến thức bọc răng sứ' },
              { id: '2', name: 'Kiến thức tổng quát' },
              { id: '3', name: 'Kiến thức niềng răng' },
              { id: '4', name: 'Kiến thức trồng răng' }
            ]);
        }
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);
    
    const handleSave = async (data: any) => {
        try {
            const id = data.id || Date.now().toString();
            await supabase.from('blogCategories').upsert({ ...data, id });
            setEditingCat(null);
            fetchCats();
        } catch(e) {}
    }
    
    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
        try {
            await supabase.from('blogCategories').delete().eq('id', id);
            fetchCats();
        } catch(e) {}
    }

    if (loading) return <div className="p-8 text-center">Đang tải...</div>;
    return (
        <div className="p-4 space-y-4">
            <h3 className="text-xl font-bold">Danh mục bài viết</h3>
            {editingCat && (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center gap-3">
                    <input type="text" placeholder="Tên danh mục..." value={editingCat.name || ''} onChange={e => setEditingCat({...editingCat, name: e.target.value})} className="border p-2 rounded flex-1" />
                    <button onClick={() => handleSave(editingCat)} className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
                    <button onClick={() => setEditingCat(null)} className="text-gray-500">Hủy</button>
                </div>
            )}
            {!editingCat && (
                <button onClick={() => setEditingCat({})} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
                    <Plus size={16} /> Thêm danh mục
                </button>
            )}
            <ul className="space-y-2 mt-4">
                {categories.map(cat => (
                    <li key={cat.id} className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                        <span className="font-bold">{cat.name}</span>
                        <div className="flex items-center gap-3">
                             <button onClick={() => setEditingCat(cat)} className="text-gray-600 hover:text-blue-600"><Pencil size={18} /></button>
                             <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
import { compressImage } from '../lib/imageUtils';

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const isSavingRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'published' | 'draft' | 'trash' | 'categories'>('published');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ published: 0, draft: 0, trash: 0 });
  const POSTS_PER_PAGE = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCounts = async () => {
    try {
      const getCount = async (statusFilter: string) => {
        let q = supabase.from('blogPosts').select('id', { count: 'exact', head: true });
        if (statusFilter === 'published') {
           q = q.or('status.eq.published,status.is.null');
        } else {
           q = q.eq('status', statusFilter);
        }
        const { count } = await q;
        return count || 0;
      };
      const [pub, draft, trash] = await Promise.all([
        getCount('published'),
        getCount('draft'),
        getCount('trash')
      ]);
      setCounts({ published: pub, draft, trash });
    } catch(e) {
       console.error("Count error:", e);
    }
  };

  const fetchPosts = useCallback(async (showLoading = true) => {
    if (currentTab === 'categories') return;
    if (showLoading) setLoading(true);
    try {
      let query = supabase
        .from('blogPosts')
        .select('id, title, slug, category, status, date, createdAt, deletedAt', { count: 'exact' });

      // Tab filter
      if (currentTab === 'published') {
        query = query.or('status.eq.published,status.is.null');
      } else {
        query = query.eq('status', currentTab);
      }

      // Search filter
      if (debouncedSearch) {
        query = query.ilike('title', `%${debouncedSearch}%`);
      }

      // Pagination
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;
      query = query.order('createdAt', { ascending: false, nullsFirst: false }).range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      setPosts(data || []);
      setTotalPages(count ? Math.ceil(count / POSTS_PER_PAGE) : 1);
      
      if (!debouncedSearch) {
         fetchCounts(); // Update counts if not searching
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [currentTab, page, debouncedSearch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleEdit = async (postSummary: any) => {
    setIsCreating(false);
    // Fetch full post detail when editing
    try {
      const { data, error } = await supabase.from('blogPosts').select('*').eq('id', postSummary.id).single();
      if (error) throw error;
      setEditingPost({
        ...data,
        content: data.content || '',
        blocks: data.blocks || [],
        slug: data.slug || data.id,
        status: data.status || 'published',
        author: data.author || '',
        category: data.category || ''
      });
    } catch(e) {
      alert("Lỗi khi tải chi tiết bài viết");
    }
  };

  const handleCreateNew = () => {
    setEditingPost({
      id: '',
      title: '',
      slug: '',
      category: '',
      image: '',
      author: '',
      content: '',
      status: 'draft',
      blocks: []
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleSave = async (forceStatus?: 'draft' | 'published' | 'trash', isBackgroundMode = false) => {
    if (!editingPost.title || !editingPost.slug) {
       if (!isBackgroundMode) alert("Vui lòng nhập tiêu đề và đường dẫn");
       return;
    }

    if (isSavingRef.current) {
        if (!isBackgroundMode) {
           alert("Hệ thống đang lưu, vui lòng thử lại sau giây lát.");
        }
        return;
    }
    isSavingRef.current = true;

    const postId = editingPost.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const currentDate = new Date().toLocaleDateString('vi-VN');
    
    const isPublishing = forceStatus === 'published' || (!forceStatus && editingPost.status === 'published');
    const updateData = { 
        ...editingPost, 
        id: postId,
        status: forceStatus || editingPost.status || 'draft',
        date: editingPost.date || currentDate,
        ...(isCreating ? { createdAt: Date.now() } : {})
    };

    try {
      const { saveBlogPost, deleteBlogPost } = await import('@/app/actions/blog');
      const res = await saveBlogPost(updateData, isCreating, editingPost.id);
      
      if (!res.success) {
        if (!isBackgroundMode) alert(res.error || "Đã xảy ra lỗi khi lưu.");
        isSavingRef.current = false;
        return;
      }

      if (!isBackgroundMode) {
         setEditingPost(null);
         setIsCreating(false);
         fetchPosts(false);
         alert(`Bài viết đã được ${isPublishing ? 'xuất bản' : 'lưu nháp'} thành công!`);
      } else {
         setIsCreating(false);
         setEditingPost((prev: any) => {
            if (!prev) return null; // If unmounted or cancelled, keep it null
            return {...prev, id: res.newId || postId};
         });
         fetchPosts(false);
      }
    } catch (e: any) {
      console.error("Error saving post", e);
      if (!isBackgroundMode) alert("Đã xảy ra lỗi khi lưu.");
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể phục hồi!')) return;
    try {
      const { permanentlyDeleteBlogPost } = await import('@/app/actions/blog');
      const res = await permanentlyDeleteBlogPost(id);
      if (!res.success) throw new Error(res.error);
      fetchPosts();
    } catch (e: any) {
      alert("Có lỗi xảy ra: " + e.message);
    }
  };

  const handleMoveToTrash = async (post: any) => {
     if (!confirm('Bạn có chắc chắn muốn chuyển bài viết này vào thùng rác?')) return;
     try {
        const { deleteBlogPost } = await import('@/app/actions/blog');
        const res = await deleteBlogPost(post.id);
        if (!res.success) throw new Error(res.error);
        fetchPosts();
     } catch (e: any) {
        alert("Có lỗi xảy ra: " + e.message);
     }
  };

  const handleRestore = async (post: any) => {
     try {
        const { saveBlogPost } = await import('@/app/actions/blog');
        const res = await saveBlogPost({ ...post, status: 'draft', deletedAt: null }, false, post.id);
        if (!res.success) throw new Error(res.error);
        fetchPosts();
     } catch (e: any) {
        console.error(e);
        alert("Có lỗi xảy ra: " + e.message);
     }
  };

  const handleBulkDelete = async () => {
    if (selectedPostIds.length === 0) return;
    try {
      const { bulkDeleteBlogPosts, bulkTrashBlogPosts } = await import('@/app/actions/blog');
      if (currentTab === 'trash') {
        if (!confirm("Bác có chắc chắn muốn xóa vĩnh viễn các bài viết này?")) return;
        const res = await bulkDeleteBlogPosts(selectedPostIds);
        if (!res.success) throw new Error(res.error);
      } else {
        if (!confirm("Đưa các bài viết đã chọn vào thùng rác?")) return;
        const res = await bulkTrashBlogPosts(selectedPostIds);
        if (!res.success) throw new Error(res.error);
      }
      setSelectedPostIds([]);
      fetchPosts();
    } catch (e: any) {
      alert("Có lỗi xảy ra: " + e.message);
    }
  };

  const toggleSelectPost = (id: string) => {
    setSelectedPostIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedPostIds.length === posts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(posts.map(p => p.id));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải danh sách bài viết...</div>;

  if (editingPost) {
    return (
      <BlogEditor 
        post={editingPost} 
        onChange={setEditingPost} 
        onSave={handleSave} 
        onAutoSave={(status: any) => handleSave(status, true)}
        onCancel={handleCancel} 
      />
    );
  }

  const activePosts = posts.filter(p => currentTab === 'published' ? (p.status === 'published' || !p.status) : currentTab === 'draft' ? p.status === 'draft' : p.status === 'trash');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold font-sans text-gray-800">Quản lý Góc kiến thức</h2>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => fetchPosts()} 
             className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-gray-200 transition"
          >
            <RotateCcw size={18} /> Tải lại
          </button>
          <button onClick={handleCreateNew} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus size={18} /> Viết bài mới
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row border-b border-gray-200 bg-gray-50 px-4 justify-between md:items-center py-2 gap-4">
          <div className="flex overflow-x-auto hide-scrollbar">
             <button 
               onClick={() => { setCurrentTab('published'); setSelectedPostIds([]); }} 
               className={`whitespace-nowrap p-3 font-medium text-sm border-b-2 mr-4 ${currentTab === 'published' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
             >
               Đã xuất bản ({counts.published})
             </button>
             <button 
               onClick={() => { setCurrentTab('draft'); setSelectedPostIds([]); }} 
               className={`whitespace-nowrap p-3 font-medium text-sm border-b-2 mr-4 ${currentTab === 'draft' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
             >
               Bản nháp ({counts.draft})
             </button>
             <button 
               onClick={() => { setCurrentTab('trash'); setSelectedPostIds([]); }} 
               className={`whitespace-nowrap p-3 font-medium text-sm border-b-2 mr-4 flex items-center gap-1 ${currentTab === 'trash' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
             >
               <Trash2 size={16} /> Thùng rác ({counts.trash})
             </button>
             <button 
               onClick={() => { setCurrentTab('categories'); setSelectedPostIds([]); }} 
               className={`whitespace-nowrap p-3 font-medium text-sm border-b-2 flex items-center gap-1 ${currentTab === 'categories' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
             >
               Danh mục
             </button>
          </div>
          <div className="flex items-center gap-3">
            {currentTab !== 'categories' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bài viết..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-64"
                />
              </div>
            )}
            {selectedPostIds.length > 0 && (
              <button 
                onClick={handleBulkDelete} 
                className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-600 transition flex items-center gap-1 shrink-0"
              >
                <Trash2 size={14} /> {currentTab === 'trash' ? 'Xóa vĩnh viễn' : 'Xóa'} ({selectedPostIds.length})
              </button>
            )}
          </div>
        </div>

        {currentTab === 'categories' ? (
           <BlogCategoriesManager />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-sm">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 cursor-pointer" 
                    checked={posts.length > 0 && selectedPostIds.length === posts.length} 
                    onChange={toggleSelectAll} 
                  />
                </th>
                <th className="p-4 font-semibold text-gray-700">Tiêu đề / Bài viết</th>
                <th className="p-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-700">Chuyên mục</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 cursor-pointer" 
                      checked={selectedPostIds.includes(post.id)} 
                      onChange={() => toggleSelectPost(post.id)} 
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => post.status !== 'trash' && handleEdit(post)}>{post.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{post.slug}</div>
                    {post.status === 'trash' && post.deletedAt && (
                      <div className="text-xs text-red-500 mt-1 italic">Đã xóa vào: {new Date(post.deletedAt).toLocaleDateString('vi-VN')}</div>
                    )}
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 text-xs font-bold rounded-sm ${post.status === 'published' ? 'bg-green-100 text-green-800' : post.status === 'trash' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}>
                        {post.status === 'published' ? 'Đã xuất bản' : post.status === 'trash' ? 'Thùng rác' : 'Bản nháp'}
                     </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{post.category || '—'}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {post.status !== 'trash' ? (
                       <>
                         <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Chỉnh sửa</button>
                         <button onClick={() => handleMoveToTrash(post)} className="text-red-500 hover:text-red-700 text-sm font-medium">Xóa</button>
                       </>
                    ) : (
                       <>
                         <button onClick={() => handleRestore(post)} className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1 ml-auto mr-3 inline-flex">
                            <RotateCcw size={14} /> Khôi phục
                         </button>
                         <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 text-sm font-medium inline-block mt-3">Xóa vĩnh viễn</button>
                       </>
                    )}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Không có bài viết nào trong mục này.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
             <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
                <button 
                  disabled={page <= 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 bg-white"
                >
                  Trang trước
                </button>
                <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
                <button 
                  disabled={page >= totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 bg-white"
                >
                  Trang tiếp
                </button>
             </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

function BlogEditor({ post, onChange, onSave, onAutoSave, onCancel }: any) {
  const autoSaveRef = useRef(onAutoSave);
  const postRef = useRef(post);
  const isManuallySavingRef = useRef(false);
  const [categories, setCategories] = useState<any[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const htmlUploadRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function fetchCats() {
      try {
        const { data } = await supabase.from('blogCategories').select('*');
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories([
            { id: '1', name: 'Kiến thức bọc răng sứ' },
            { id: '2', name: 'Kiến thức tổng quát' },
            { id: '3', name: 'Kiến thức niềng răng' },
            { id: '4', name: 'Kiến thức trồng răng' }
          ]);
        }
      } catch(e) {
        setCategories([
          { id: '1', name: 'Kiến thức bọc răng sứ' },
          { id: '2', name: 'Kiến thức tổng quát' },
          { id: '3', name: 'Kiến thức niềng răng' },
          { id: '4', name: 'Kiến thức trồng răng' }
        ]);
      }
    }
    fetchCats();
  }, []);

  // Initialize editor content from post.content or from blocks (migration)
  useEffect(() => {
    if (editorRef.current) {
      let initialContent = post.content || '';
      // If the post has blocks but no content, convert blocks to HTML for backward compat
      if (!initialContent && post.blocks && post.blocks.length > 0) {
        initialContent = blocksToHtml(post.blocks);
      }
      editorRef.current.innerHTML = initialContent;
    }
  }, []); // Only run once on mount

  useEffect(() => {
    autoSaveRef.current = onAutoSave;
    postRef.current = post;
  }, [onAutoSave, post]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isManuallySavingRef.current && postRef.current?.status === 'draft') {
        autoSaveRef.current?.('draft');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    const intervalId = setInterval(() => {
      if (postRef.current?.status === 'draft' || !postRef.current?.id) {
        syncContentFromEditor();
        autoSaveRef.current?.('draft');
      }
    }, 15000);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(intervalId);
      if (!isManuallySavingRef.current && (postRef.current?.status === 'draft' || !postRef.current?.id)) {
        autoSaveRef.current?.('draft');
      }
    };
  }, []);

  const syncContentFromEditor = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange((prev: any) => ({ ...prev, content: html, blocks: [] }));
    }
  };

  const handleManualSave = (status: 'draft' | 'published' | 'trash') => {
    syncContentFromEditor();
    isManuallySavingRef.current = true;
    setTimeout(() => onSave(status), 50);
  };

  const setField = (field: string, value: any) => {
    onChange({ ...post, [field]: value });
  };

  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const handleToolbar = (action: string) => {
    switch (action) {
      case 'bold': execCommand('bold'); break;
      case 'italic': execCommand('italic'); break;
      case 'h2': execCommand('formatBlock', '<h2>'); break;
      case 'h3': execCommand('formatBlock', '<h3>'); break;
      case 'ul': execCommand('insertUnorderedList'); break;
      case 'ol': execCommand('insertOrderedList'); break;
      case 'blockquote': execCommand('formatBlock', '<blockquote>'); break;
      case 'image': fileInputRef.current?.click(); break;
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `blog/${fileName}`;
      const { data, error } = await supabase.storage.from('public_assets').upload(filePath, file);
      if (error) {
        alert("Vui lòng tạo Storage bucket tên là 'public_assets' trong Supabase để upload ảnh.");
        return '';
      }
      const { data: publicUrlData } = supabase.storage.from('public_assets').getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    } catch (e) {
      console.error(e);
      alert("Vui lòng tạo Storage bucket tên là 'public_assets' trong Supabase để upload ảnh.");
      return '';
    }
  };

  const handleEditorImageInsert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleImageUpload(file);
    if (url) {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, `<img src="${url}" alt="" style="max-width:100%; height:auto; margin: 16px 0; border-radius: 8px;" />`);
    }
    e.target.value = '';
  };

  const handleCoverUpload = async (file: File) => {
    const url = await handleImageUpload(file);
    if (url) setField('image', url);
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleCoverUpload(file);
    }
  };

  const handleHtmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const html = ev.target?.result as string;
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        syncContentFromEditor();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-gray-50 min-h-screen -m-8 p-8 font-sans text-gray-800">
      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 italic">
              {post.id ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {post.id ? 'Chỉnh sửa nội dung bài viết hiện có.' : 'Tạo một bài viết mới cho Góc Kiến Thức.'}
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Cover Image Upload */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Ảnh đại diện bài viết</label>
          {post.image ? (
            <div className="relative group rounded-lg overflow-hidden border border-gray-200">
              <img src={post.image} alt="Cover" className="w-full h-auto max-h-[300px] object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow hover:bg-gray-100 transition"
                >
                  Thay đổi ảnh
                </button>
                <button
                  onClick={() => setField('image', '')}
                  className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600 transition"
                >
                  Xóa ảnh
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => coverInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleCoverDrop}
            >
              <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">Nhấn để tải lên hoặc kéo thả ảnh</p>
              <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF lên đến 5MB</p>
            </div>
          )}
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await handleCoverUpload(file);
            e.target.value = '';
          }} />
        </div>

        {/* Title + Slug + Author + Status + Category */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề</label>
              <input
                type="text"
                value={post.title || ''}
                onChange={e => {
                  const title = e.target.value;
                  onChange((prev: any) => {
                    if (!prev.slug || prev.slug === '') {
                      return {
                        ...prev,
                        title,
                        slug: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u0111/g, "d").replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      };
                    }
                    return { ...prev, title };
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Nhập tiêu đề bài viết..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Đường dẫn (Slug)</label>
              <input
                type="text"
                value={post.slug || ''}
                onChange={e => setField('slug', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="duong-dan-bai-viet"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tác giả</label>
              <input
                type="text"
                value={post.author || ''}
                onChange={e => setField('author', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Tên tác giả..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái</label>
              <select
                value={post.status || 'draft'}
                onChange={e => setField('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chuyên mục</label>
            <select
              value={post.category || ''}
              onChange={e => setField('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">-- Chọn chuyên mục --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rich Text Content Editor */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 bg-gray-50">
            <label className="text-sm font-semibold text-gray-700">Nội dung</label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => htmlUploadRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition"
              >
                <ChevronUp size={14} /> Tải lên tệp .html
              </button>
              <input ref={htmlUploadRef} type="file" accept=".html,.htm" className="hidden" onChange={handleHtmlUpload} />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 px-4 py-2 border-b border-gray-200 bg-white">
            <button onClick={() => handleToolbar('bold')} className="px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded transition" title="Bold">Bold</button>
            <button onClick={() => handleToolbar('italic')} className="px-3 py-1.5 text-sm italic text-gray-700 hover:bg-gray-100 rounded transition" title="Italic">Italic</button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button onClick={() => handleToolbar('h2')} className="px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded transition" title="Heading 2">H2</button>
            <button onClick={() => handleToolbar('h3')} className="px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded transition" title="Heading 3">H3</button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button onClick={() => handleToolbar('ul')} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition" title="Bullet List">Bullet List</button>
            <button onClick={() => handleToolbar('ol')} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition" title="Ordered List">Ordered List</button>
            <button onClick={() => handleToolbar('blockquote')} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition" title="Blockquote">Blockquote</button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button onClick={() => handleToolbar('image')} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition flex items-center gap-1" title="Thêm ảnh">
              <ImageIcon size={14} /> Thêm ảnh
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditorImageInsert} />
          </div>

          {/* Editable Content Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[350px] p-6 text-base leading-relaxed text-gray-800 outline-none prose prose-lg max-w-none
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-gray-800
              [&_p]:mb-3 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
              [&_li]:mb-1
              [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4
              [&_a]:text-blue-600 [&_a]:underline
            "
            onInput={() => syncContentFromEditor()}
            onBlur={() => syncContentFromEditor()}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition text-sm"
          >
            Hủy
          </button>
          <button
            onClick={() => handleManualSave('draft')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition text-sm"
          >
            Lưu nháp
          </button>
          <button
            onClick={() => handleManualSave('published')}
            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow transition text-sm"
          >
            Lưu bài viết
          </button>
        </div>

      </div>
    </div>
  );
}

// Convert old block data to HTML for backward compatibility when editing old posts
function blocksToHtml(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  return blocks.map((block: any) => {
    const data = block.data || {};
    switch (block.type) {
      case 'h2': return `<h2>${data.text || ''}</h2>`;
      case 'h3': return `<h3>${data.text || ''}</h3>`;
      case 'p': return `<p>${data.text || ''}</p>`;
      case 'ul': return `<ul>${(data.items || []).map((item: string) => `<li>${item}</li>`).join('')}</ul>`;
      case 'ol': return `<ol>${(data.items || []).map((item: string) => `<li>${item}</li>`).join('')}</ol>`;
      case 'image': return data.url ? `<img src="${data.url}" alt="${data.alt || ''}" />` : '';
      case 'figure': return data.url ? `<figure><img src="${data.url}" alt="${data.alt || ''}" />${data.caption ? `<figcaption>${data.caption}</figcaption>` : ''}</figure>` : '';
      case 'note': return `<blockquote><strong>${data.title || ''}</strong><br/>${data.content || ''}</blockquote>`;
      case 'warning': return `<blockquote><strong>${data.title || ''}</strong><br/>${data.content || ''}</blockquote>`;
      case 'table': {
        const headers = data.headers || [];
        const rows = data.rows || [];
        return `<table><thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((row: string[]) => `<tr>${row.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      }
      default: return '';
    }
  }).join('\n');
}


