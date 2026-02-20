'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pvs: 0, visitors: 0, history: [] });
  const [dbStats, setDbStats] = useState({ totalMenu: 0, totalCategories: 0, totalNews: 0 });
  const [recentMenu, setRecentMenu] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // クライアントサイドでのみlocalStorageにアクセス
    const loadStats = () => {
      const savedStats = JSON.parse(localStorage.getItem('tairikudana_stats') || '{"pvs": 0, "visitors": 0, "history": []}');
      setStats(savedStats);
    };

    const fetchDbData = async () => {
      const { data: menuData } = await supabase.from('menu_items').select('*');
      const { data: newsData } = await supabase.from('news_items').select('*').order('published_at', { ascending: false });
      const { data: catData } = await supabase.from('categories').select('*');

      setDbStats({
        totalMenu: menuData?.length || 0,
        totalNews: newsData?.length || 0,
        totalCategories: catData?.length || 0
      });

      setRecentMenu(menuData?.filter(i => i.is_recommended).slice(0, 5) || []);
      setRecentNews(newsData?.slice(0, 5) || []);
      setLoading(false);
    };

    loadStats();
    fetchDbData();
  }, []);

  const maxPv = Math.max(...stats.history.map(h => h.pv), 1);


  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">📊 ダッシュボード</h1>
      </div>

      <div className="admin-stats">
        <div className="stat-card stat-accent">
          <div className="stat-card-icon">👁️</div>
          <div className="stat-card-value">{stats.pvs.toLocaleString()}</div>
          <div className="stat-card-label">総ページビュー (PV)</div>
        </div>
        <div className="stat-card stat-accent">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-value">{stats.visitors.toLocaleString()}</div>
          <div className="stat-card-label">累計訪問者数</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🍽️</div>
          <div className="stat-card-value">{dbStats.totalMenu}</div>
          <div className="stat-card-label">登録メニュー</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📢</div>
          <div className="stat-card-value">{dbStats.totalNews}</div>
          <div className="stat-card-label">お知らせ投稿</div>
        </div>
      </div>

      <div className="admin-table-wrap" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>📈 最近のアクセス傾向</h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-dim)' }}>直近数時間のアクティビティ</span>
        </div>
        <div style={{ padding: 'var(--space-xl)', height: '180px', display: 'flex', alignItems: 'flex-end', gap: 'var(--space-md)' }}>
          {stats.history.length > 0 ? (
            stats.history.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${(h.pv / maxPv) * 120}px`, 
                    minHeight: h.pv > 0 ? '4px' : '0',
                    background: 'linear-gradient(to top, var(--color-accent), var(--color-gold))', 
                    borderRadius: '2px 2px 0 0',
                    opacity: 0.8,
                    transition: 'height 0.6s ease-out'
                  }} 
                />
                <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', transform: 'scale(0.8)' }}>{h.time}</span>
              </div>
            ))
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-dim)' }}>
              統計データがまだありません
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
        <div className="admin-table-wrap">
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>最近のおすすめメニュー</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>メニュー名</th>
                <th>価格</th>
              </tr>
            </thead>
            <tbody>
              {recentMenu.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>¥{item.price?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-table-wrap">
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>最新のお知らせ</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>タイトル</th>
                <th>状態</th>
              </tr>
            </thead>
            <tbody>
              {recentNews.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <span
                      style={{
                        color: item.is_published ? 'var(--color-green)' : 'var(--color-text-dim)',
                        fontWeight: 500,
                        fontSize: 'var(--font-size-xs)',
                      }}
                    >
                      {item.is_published ? '✅ 公開中' : '⏸️ 下書き'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          marginTop: 'var(--space-2xl)',
          padding: 'var(--space-xl)',
          background: 'rgba(212, 162, 78, 0.05)',
          border: '1px solid rgba(212, 162, 78, 0.2)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <h3 style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-sm)' }}>📝 クイックガイド</h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
          左のメニューから「メニュー管理」でメニューの追加・編集・削除ができます。<br />
          「お知らせ管理」ではキャンペーンやお休みのお知らせを投稿できます。<br />
          変更は保存後すぐに公開サイトに反映されます。
        </p>
      </div>
    </div>
  );
}
