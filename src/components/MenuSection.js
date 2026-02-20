'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: catData } = await supabase.from('categories').select('*').order('sort_order');
      const { data: menuData } = await supabase.from('menu_items').select('*').order('sort_order');
      setCategories(catData || []);
      setMenuItems(menuData || []);
    }
    fetchData();
  }, []);

  const filtered =
    activeTab === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category_id === activeTab);

  const sorted = [...filtered].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="section" id="menu">
      <div className="container">
        <h2 className="section-title">メニュー</h2>
        <p className="section-subtitle">MENU</p>
        <div className="section-divider" />

        <div className="menu-tabs">
          <button
            className={`menu-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`menu-tab ${activeTab === cat.id ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {sorted.map((item) => (
            <div
              key={item.id}
              className={`menu-card ${item.is_sold_out ? 'sold-out' : ''}`}
            >
              {item.is_recommended && (
                <span className="menu-badge">おすすめ</span>
              )}
              {item.is_sold_out && (
                <span className="menu-badge menu-badge-soldout">品切れ</span>
              )}
              <div className="menu-card-image">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '3rem' }}>🍽️</span>
                )}
              </div>
              <div className="menu-card-body">
                <h3 className="menu-card-name">{item.name}</h3>
                {item.description && (
                  <p className="menu-card-desc">{item.description}</p>
                )}
                {item.allergens && (
                  <p className="menu-card-allergen">⚠️ {item.allergens}</p>
                )}
                <p className="menu-card-price">
                  ¥{item.price?.toLocaleString()}
                  <span className="menu-card-tax">（税込）</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
