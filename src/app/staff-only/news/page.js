'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await supabase.from('news_items').select('*').order('published_at', { ascending: false });
    setNewsList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

  const emptyItem = {
    title: '',
    content: '',
    published_at: new Date().toISOString().split('T')[0],
    is_published: true,
  };

  const openAdd = () => {
    setEditingItem({ ...emptyItem, isNew: true });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem({
      ...item,
      published_at: typeof item.published_at === 'string' ? item.published_at.split('T')[0] : item.published_at,
      isNew: false
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingItem.title) return;
    
    const { isNew, ...itemData } = editingItem;
    // 日付をISO形式に調整
    const payload = {
      ...itemData,
      published_at: itemData.published_at + 'T00:00:00Z'
    };

    let error;
    if (isNew) {
      const { error: insertError } = await supabase.from('news_items').insert([payload]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase.from('news_items').update(payload).eq('id', itemData.id);
      error = updateError;
    }

    if (error) {
      alert('保存に失敗しました: ' + error.message);
    } else {
      fetchNews();
      setShowModal(false);
      setEditingItem(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('このお知らせを削除しますか？')) {
      const { error } = await supabase.from('news_items').delete().eq('id', id);
      if (error) alert('削除に失敗しました: ' + error.message);
      else fetchNews();
    }
  };

  const togglePublished = async (id, currentStatus) => {
    const { error } = await supabase.from('news_items').update({ is_published: !currentStatus }).eq('id', id);
    if (error) alert('更新に失敗しました');
    else fetchNews();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const sortedNews = [...newsList].sort(
    (a, b) => new Date(b.published_at) - new Date(a.published_at)
  );

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">📢 お知らせ管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          ＋ お知らせ追加
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>日付</th>
              <th>タイトル</th>
              <th>公開状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedNews.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.published_at)}</td>
                <td>
                  <strong>{item.title}</strong>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-dim)',
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.content}
                  </span>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={item.is_published}
                      onChange={() => togglePublished(item.id)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={() => openEdit(item)}>
                      編集
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 編集/追加モーダル */}
      {showModal && editingItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem.isNew ? 'お知らせ追加' : 'お知らせ編集'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">タイトル *</label>
              <input
                type="text"
                className="form-input"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="例: 🎉 年末年始の営業時間のお知らせ"
              />
            </div>

            <div className="form-group">
              <label className="form-label">内容</label>
              <textarea
                className="form-textarea"
                value={editingItem.content}
                onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                placeholder="お知らせの内容を入力..."
                style={{ minHeight: 120 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">公開日</label>
              <input
                type="date"
                className="form-input"
                value={editingItem.published_at}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, published_at: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={editingItem.is_published}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, is_published: e.target.checked })
                  }
                />
                公開する
              </label>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowModal(false)}
              >
                キャンセル
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
