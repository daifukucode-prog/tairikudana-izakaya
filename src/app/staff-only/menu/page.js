'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from('categories').select('*').order('sort_order');
    const { data: menuData } = await supabase.from('menu_items').select('*').order('sort_order');
    setCategories(catData || []);
    setMenuItems(menuData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

  const emptyItem = {
    id: '',
    category_id: '1',
    name: '',
    price: 0,
    description: '',
    image_url: null,
    allergens: '',
    is_recommended: false,
    is_sold_out: false,
    sort_order: 0,
  };

  const openAdd = () => {
    setEditingItem({ ...emptyItem, id: `item-${Date.now()}` });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem({ ...item });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingItem.name) return;
    const { error } = await supabase.from('menu_items').upsert(editingItem);
    if (error) {
      alert('保存に失敗しました: ' + error.message);
    } else {
      fetchData();
      setShowModal(false);
      setEditingItem(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('このメニューを削除しますか？')) {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) alert('削除に失敗しました: ' + error.message);
      else fetchData();
    }
  };

  const toggleSoldOut = async (id, currentStatus) => {
    const { error } = await supabase.from('menu_items').update({ is_sold_out: !currentStatus }).eq('id', id);
    if (error) alert('更新に失敗しました');
    else fetchData();
  };

  const toggleRecommended = async (id, currentStatus) => {
    const { error } = await supabase.from('menu_items').update({ is_recommended: !currentStatus }).eq('id', id);
    if (error) alert('更新に失敗しました');
    else fetchData();
  };

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : '';
  };

  const filtered =
    filterCategory === 'all'
      ? menuItems
      : menuItems.filter((i) => i.category_id === filterCategory);

  const sorted = [...filtered].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">🍽️ メニュー管理</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          ＋ メニュー追加
        </button>
      </div>

      <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button
          className={`menu-tab ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          すべて ({menuItems.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`menu-tab ${filterCategory === cat.id ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat.id)}
          >
            {cat.name} ({menuItems.filter((i) => i.category_id === cat.id).length})
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>順</th>
              <th>メニュー名</th>
              <th>カテゴリ</th>
              <th>価格</th>
              <th>おすすめ</th>
              <th>販売中</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.id}>
                <td>{item.sort_order}</td>
                <td>
                  <strong>{item.name}</strong>
                  {item.allergens && (
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-dim)', display: 'block' }}>
                      ⚠️ {item.allergens}
                    </span>
                  )}
                </td>
                <td>{getCategoryName(item.category_id)}</td>
                <td>¥{item.price?.toLocaleString()}</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={item.is_recommended}
                      onChange={() => toggleRecommended(item.id)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={!item.is_sold_out}
                      onChange={() => toggleSoldOut(item.id)}
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
                {editingItem.id.startsWith('new-') ? 'メニュー追加' : 'メニュー編集'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">メニュー名 *</label>
              <input
                type="text"
                className="form-input"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="例: 牛肉串"
              />
            </div>

            <div className="form-group">
              <label className="form-label">カテゴリ</label>
              <select
                className="form-select"
                value={editingItem.category_id}
                onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">価格（税込・円）</label>
              <input
                type="number"
                className="form-input"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">説明</label>
              <textarea
                className="form-textarea"
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="メニューの説明を入力"
              />
            </div>

            <div className="form-group">
              <label className="form-label">アレルゲン</label>
              <input
                type="text"
                className="form-input"
                value={editingItem.allergens}
                onChange={(e) => setEditingItem({ ...editingItem, allergens: e.target.value })}
                placeholder="例: 小麦, 卵, 乳"
              />
            </div>

            <div className="form-group">
              <label className="form-label">表示順</label>
              <input
                type="number"
                className="form-input"
                value={editingItem.sort_order}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, sort_order: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">画像URL</label>
              <input
                type="text"
                className="form-input"
                value={editingItem.image_url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-dim)', marginTop: 'var(--space-xs)' }}>
                ※Supabase接続後はファイルアップロードに変更されます
              </p>
            </div>

            <div className="form-group">
              <div className="form-checkbox-group">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingItem.is_recommended}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, is_recommended: e.target.checked })
                    }
                  />
                  おすすめに表示
                </label>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingItem.is_sold_out}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, is_sold_out: e.target.checked })
                    }
                  />
                  品切れ中
                </label>
              </div>
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
