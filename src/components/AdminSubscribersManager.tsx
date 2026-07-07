'use client';
import { useState, useEffect, useMemo } from 'react';
import { Trash2, Download, Search, Mail, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { db, collection, getDocs, doc, setDoc, deleteDoc } from '../localDB';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  subscribedAt: number;
  status: string;
}

export default function AdminSubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'subscribers'));
      const data = snap.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
      })) as Subscriber[];
      // Sort by subscribedAt descending (newest first)
      data.sort((a, b) => (b.subscribedAt || 0) - (a.subscribedAt || 0));
      setSubscribers(data);
    } catch (e) {
      console.error('Failed to load subscribers:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
    const handleUpdate = () => fetchSubscribers();
    if (typeof window !== 'undefined') {
      window.addEventListener('localDB_updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('localDB_updated', handleUpdate);
      }
    };
  }, []);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = subscribers.length;
    const active = subscribers.filter((s) => s.status === 'active').length;
    const unsubscribed = subscribers.filter((s) => s.status === 'unsubscribed').length;
    return { total, active, unsubscribed };
  }, [subscribers]);

  const handleToggleStatus = async (sub: Subscriber) => {
    const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
    await setDoc(doc(collection(db, 'subscribers'), sub.id), {
      ...sub,
      status: newStatus,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa email này khỏi danh sách?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(collection(db, 'subscribers'), id));
    } catch (e) {
      console.error('Delete failed:', e);
    }
    setDeletingId(null);
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Nguồn', 'Ngày đăng ký', 'Trạng thái'];
    const rows = filteredSubscribers.map((sub) => [
      sub.email,
      sub.source || 'cta',
      sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString('vi-VN') : '',
      sub.status || 'active',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts: number) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Đăng Ký</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý danh sách email khách hàng đã đăng ký qua website</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubscribers}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Tải lại"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filteredSubscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          <div className="text-xs text-blue-600 mt-1">Tổng cộng</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.active}</div>
          <div className="text-xs text-green-600 mt-1">Đang hoạt động</div>
        </div>
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-500">{stats.unsubscribed}</div>
          <div className="text-xs text-gray-500 mt-1">Đã hủy</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="unsubscribed">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          Đang tải...
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">
            {subscribers.length === 0
              ? 'Chưa có email nào được đăng ký'
              : 'Không tìm thấy email phù hợp'}
          </p>
          <p className="text-sm mt-1">
            {subscribers.length === 0
              ? 'Email sẽ xuất hiện ở đây khi khách hàng đăng ký từ trang web'
              : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nguồn</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Ngày đăng ký</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((sub, idx) => (
                <tr
                  key={sub.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{sub.source || 'cta'}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(sub.subscribedAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {sub.status === 'active' ? (
                        <>
                          <UserCheck className="w-3 h-3" /> Hoạt động
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" /> Đã hủy
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          sub.status === 'active'
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={sub.status === 'active' ? 'Hủy đăng ký' : 'Kích hoạt lại'}
                      >
                        {sub.status === 'active' ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deletingId === sub.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
