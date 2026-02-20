'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsSection() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from('news_items')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      setNews(data || []);
    }
    fetchNews();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <section className="section" id="news">
      <div className="container">
        <h2 className="section-title">お知らせ</h2>
        <p className="section-subtitle">NEWS</p>
        <div className="divider" />

        <div className="news-list">
          {news.map((item) => (
            <article key={item.id} className="news-item">
              <div className="news-item-date">{formatDate(item.published_at)}</div>
              <h3 className="news-item-title">{item.title}</h3>
              <p className="news-item-content">{item.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
