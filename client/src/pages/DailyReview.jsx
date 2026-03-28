import React, { useState, useEffect } from 'react'

export default function DailyReview() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [form, setForm] = useState({ emotions: '', lessons: '', tomorrow_plan: '', plan_compliance: 0 })

  const load = () => {
    fetch(`/api/daily-review/${date}`).then(r => r.json()).then(data => {
      if (data.emotions) setForm(data)
      else setForm({ emotions: '', lessons: '', tomorrow_plan: '', plan_compliance: 0 })
    }).catch(() => {})
  }

  useEffect(load, [date])

  const save = async () => {
    await fetch('/api/daily-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, ...form, total_trades: 0, wins: 0, losses: 0, total_pnl: 0, win_rate: 0 })
    })
    alert('✅ Review saved!')
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>📝 Daily Review</h2>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Ngày</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Plan Compliance (%)</label>
            <input type="number" min="0" max="100" value={form.plan_compliance} onChange={e => setForm({ ...form, plan_compliance: +e.target.value })} placeholder="85" />
          </div>
        </div>

        <div className="form-group">
          <label>😊 Cảm xúc hôm nay</label>
          <textarea rows={2} value={form.emotions} onChange={e => setForm({ ...form, emotions: e.target.value })} placeholder="Tự tin, lo lắng, FOMO..." />
        </div>

        <div className="form-group">
          <label>📚 Bài học rút ra</label>
          <textarea rows={3} value={form.lessons} onChange={e => setForm({ ...form, lessons: e.target.value })} placeholder="Học được gì? Sai ở đâu? Cần cải thiện gì?" />
        </div>

        <div className="form-group">
          <label>🎯 Plan ngày mai</label>
          <textarea rows={3} value={form.tomorrow_plan} onChange={e => setForm({ ...form, tomorrow_plan: e.target.value })} placeholder="Cần chú ý gì? Setup tiềm năng?" />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={save}>💾 Lưu Review</button>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <div className="card-header"><h2>💡 Câu hỏi gợi ý</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
          {[
            'Hôm nay đúng plan bao nhiêu lệnh?',
            'Setup nào hiệu quả nhất?',
            'Tôi có revenge trade không?',
            'Cảm xúc ảnh hưởng thế nào?',
            'Điều gì cần cải thiện?',
            'Ngày mai focus vào gì?',
            'Có break rule nào không?',
            'Học được gì mới?',
          ].map((q, i) => (
            <div key={i} style={{ background: 'var(--bg)', padding: 10, borderRadius: 8, color: 'var(--text-dim)' }}>• {q}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
