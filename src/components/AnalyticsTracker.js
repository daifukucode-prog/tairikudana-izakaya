'use client';
import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    // 訪問データの初期化と更新
    const stats = JSON.parse(localStorage.getItem('tairikudana_stats') || '{"pvs": 0, "visitors": 0, "history": []}');
    
    // PV加算
    stats.pvs += 1;
    
    // ユニークユーザーの簡易判定（セッション内）
    const sessionActive = sessionStorage.getItem('tairikudana_session_active');
    if (!sessionActive) {
      stats.visitors += 1;
      sessionStorage.setItem('tairikudana_session_active', 'true');
    }

    // 履歴データの作成（デモ用に現在の時間帯のデータを1つ追加/更新）
    const now = new Date();
    const hourKey = `${now.getHours()}:00`;
    const lastEntry = stats.history[stats.history.length - 1];
    
    if (lastEntry && lastEntry.time === hourKey) {
      lastEntry.pv += 1;
    } else {
      stats.history.push({ time: hourKey, pv: 1 });
      if (stats.history.length > 12) stats.history.shift(); // 直近12時間分
    }

    localStorage.setItem('tairikudana_stats', JSON.stringify(stats));
  }, []);

  return null; // 視覚的な要素はなし
}
