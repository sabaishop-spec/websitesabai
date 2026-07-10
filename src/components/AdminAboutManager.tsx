'use client';
import { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from '../localDB';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, Save, Plus, Trash2 } from 'lucide-react';

export default function AdminAboutManager() {
  const [data, setData] = useState<any>({
    heroTitle: 'Câu chuyện FURANO',
    heroSubtitle: 'Từ một ý tưởng nhỏ để giúp mọi người có nụ cười tự tin...',
    missionText: '',
    visionText: '',
    philosophyText: '',
    teamText1: '',
    teamText2: '',
    teamImage: '',
    coreValues: [],
    timeline: [],
    scienceChecks: [],
    labImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'about'));
        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await setDoc(doc(db, 'settings', 'about'), data, { merge: true });
      alert("Đã lưu nội dung trang Giới Thiệu!");
    } catch (e) {
      alert("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setSaving(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error } = await supabase.storage.from('public_assets').upload(filePath, file);
        if (error) {
           window.alert("Lỗi upload ảnh.");
        } else {
           const { data: publicUrlData } = supabase.storage.from('public_assets').getPublicUrl(filePath);
           handleChange(key, publicUrlData.publicUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const renderImageUpload = (label: string, key: string) => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        {data[key] ? (
          <img src={data[key]} alt="Preview" className="w-32 h-32 object-cover rounded-xl border bg-gray-50 shadow-sm" />
        ) : (
          <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
            <span className="text-xs">Chưa có ảnh</span>
          </div>
        )}
        <div className="flex-1 space-y-3">
          <input 
            type="text" 
            value={data[key] || ''} 
            onChange={(e) => handleChange(key, e.target.value)} 
            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm bg-gray-50" 
            placeholder="Nhập URL..." 
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => handleFileUpload(e, key)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="animate-pulse bg-gray-100 h-96 rounded-xl w-full"></div>;

  return (
    <div className="flex flex-col h-full relative pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Trang Giới Thiệu (About)</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition shadow-sm flex items-center gap-2 fixed bottom-8 right-12 z-50 disabled:opacity-50"
        >
          {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
          <Save className="w-5 h-5" />
          {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 pb-2 border-b">1. Phần Banner Chính</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề chính</label>
              <input type="text" value={data.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Đoạn mô tả</label>
              <textarea value={data.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} className="w-full border p-2.5 rounded-lg h-24"></textarea>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 pb-2 border-b">2. Sứ mệnh, Tầm nhìn & Triết lý</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sứ mệnh</label>
              <textarea value={data.missionText || ''} onChange={e => handleChange('missionText', e.target.value)} className="w-full border p-2.5 rounded-lg h-32" placeholder="Cung cấp các sản phẩm..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tầm nhìn</label>
              <textarea value={data.visionText || ''} onChange={e => handleChange('visionText', e.target.value)} className="w-full border p-2.5 rounded-lg h-32" placeholder="Trở thành thương hiệu..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Triết lý</label>
              <textarea value={data.philosophyText || ''} onChange={e => handleChange('philosophyText', e.target.value)} className="w-full border p-2.5 rounded-lg h-32" placeholder="Không chỉ bán sản phẩm..."></textarea>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 pb-2 border-b">3. Đội ngũ FURANO</h3>
          {renderImageUpload('Ảnh Đội ngũ (Khuyên dùng tỷ lệ đứng hoặc vuông)', 'teamImage')}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Đoạn văn bản 1</label>
              <textarea value={data.teamText1 || ''} onChange={e => handleChange('teamText1', e.target.value)} className="w-full border p-2.5 rounded-lg h-24"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Đoạn văn bản 2 (Triết lý đội ngũ)</label>
              <textarea value={data.teamText2 || ''} onChange={e => handleChange('teamText2', e.target.value)} className="w-full border p-2.5 rounded-lg h-24"></textarea>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 className="font-bold text-lg">4. Hành trình FURANO (Timeline)</h3>
            <button onClick={() => {
              const newTimeline = [...(data.timeline || []), { year: new Date().getFullYear(), text: '', side: 'left' }];
              handleChange('timeline', newTimeline);
            }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4"/> Thêm Dấu mốc
            </button>
          </div>
          
          <div className="space-y-4">
            {(data.timeline || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-start gap-4 p-4 border rounded-xl bg-gray-50 relative">
                <button onClick={() => {
                  const newTimeline = [...data.timeline];
                  newTimeline.splice(idx, 1);
                  handleChange('timeline', newTimeline);
                }} className="absolute top-4 right-4 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4"/></button>
                
                <div className="w-24">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Năm</label>
                  <input type="number" value={item.year} onChange={e => {
                    const t = [...data.timeline]; t[idx].year = e.target.value; handleChange('timeline', t);
                  }} className="w-full border p-2 rounded" />
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung</label>
                  <input type="text" value={item.text} onChange={e => {
                    const t = [...data.timeline]; t[idx].text = e.target.value; handleChange('timeline', t);
                  }} className="w-full border p-2 rounded" />
                </div>
                
                <div className="w-28">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vị trí</label>
                  <select value={item.side} onChange={e => {
                    const t = [...data.timeline]; t[idx].side = e.target.value; handleChange('timeline', t);
                  }} className="w-full border p-2 rounded">
                    <option value="left">Trái</option>
                    <option value="right">Phải</option>
                  </select>
                </div>
              </div>
            ))}
            {(!data.timeline || data.timeline.length === 0) && <p className="text-gray-500 text-sm italic">Chưa có dấu mốc nào.</p>}
          </div>
        </div>

        {/* Science & Lab */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4 pb-2 border-b">5. Phát triển dựa trên Khoa học</h3>
          {renderImageUpload('Ảnh Phòng Lab', 'labImage')}
          
          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Các điểm nổi bật (Mỗi dòng 1 mục)</label>
            <textarea 
              value={(data.scienceChecks || []).join('\n')}
              onChange={e => handleChange('scienceChecks', e.target.value.split('\n').filter(Boolean))}
              className="w-full border p-2.5 rounded-lg h-32"
              placeholder="- Kiểm duyệt bởi Bộ Y tế...&#10;- Công thức an toàn..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
