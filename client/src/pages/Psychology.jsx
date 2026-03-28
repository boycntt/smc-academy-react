import React, { useState } from 'react'

const affirmations = [
  '"Mỗi lệnh là độc lập. Thua lệnh trước không ảnh hưởng lệnh sau."',
  '"Không có setup = không có lệnh."',
  '"Chờ đợi là kỹ năng quan trọng nhất."',
  '"Tham lam giết trader nhanh hơn thua lỗ."',
  '"Lệnh đúng plan nhưng thua > lệnh sai plan nhưng thắng."',
  '"Thua lỗ có kiểm soát = chi phí kinh doanh."',
  '"Process > Outcome."',
  '"Self-awareness: Biết mình FOMO = đã thắng 50% FOMO."',
]

const moodAdvice = {
  confident: '✅ Tốt! Hãy trade theo plan.',
  calm: '✅ Tốt nhất! Bình tĩnh = quyết định tốt.',
  anxious: '⚠️ Thở sâu 5 lần. Nếu vẫn lo → GIẢM lot 50%.',
  fomo: '🛑 DỪNG! KHÔNG trade khi FOMO.',
  revenge: '🛑 DỪNG NGAY! Nghỉ 30 phút.',
  tired: '⚠️ Nghỉ ngơi. KHÔNG trade khi mệt.',
}

export default function Psychology() {
  const [mood, setMood] = useState(null)
  const [affIdx, setAffIdx] = useState(0)

  const moods = [
    { key: 'confident', label: '😎 Tự tin', color: 'var(--green)' },
    { key: 'calm', label: '😌 Bình tĩnh', color: 'var(--blue)' },
    { key: 'anxious', label: '😰 Lo lắng', color: 'var(--orange)' },
    { key: 'fomo', label: '🤑 FOMO', color: 'var(--red)' },
    { key: 'revenge', label: '😤 Muốn gỡ', color: 'var(--red)' },
    { key: 'tired', label: '😴 Mệt mỏi', color: 'var(--text-dim)' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>🧠 Tâm lý giao dịch</h2>

      {/* Mood Tracker */}
      <div className="card">
        <div className="card-header"><h2>😊 Mood Tracker hôm nay</h2></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          {moods.map(m => (
            <button key={m.key} className={`btn ${mood === m.key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMood(m.key)}>{m.label}</button>
          ))}
        </div>
        {mood && <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}><strong>Kết quả:</strong> {moodAdvice[mood]}</div>}
      </div>

      {/* 4 Enemies */}
      <div className="card">
        <div className="card-header"><h2>⚔️ 4 Kẻ thù</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { name: 'SỢ HÃI', color: 'var(--red)', desc: 'Sợ mất tiền → bỏ lỡ setup', fix: 'SL đã bảo vệ bạn' },
            { name: 'THAM LAM', color: 'var(--orange)', desc: 'Không chốt TP → profit thành loss', fix: 'Chốt tại TP đã đặt' },
            { name: 'HY VỌNG', color: 'var(--blue)', desc: 'Move SL → SL nhỏ thành lớn', fix: 'KHÔNG move SL' },
            { name: 'HỐI HẬN', color: 'var(--accent-light)', desc: 'Revenge trade → thua thêm', fix: 'Nghỉ 15 phút sau thua' },
          ].map(e => (
            <div key={e.name} style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, borderLeft: `3px solid ${e.color}` }}>
              <h3 style={{ color: e.color }}>{e.name}</h3>
              <p style={{ fontSize: 13, margin: '4px 0' }}>{e.desc}</p>
              <p style={{ fontSize: 12, color: 'var(--green)' }}>→ {e.fix}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Affirmation */}
      <div className="card">
        <div className="card-header"><h2>💪 Affirmation</h2></div>
        <div style={{ background: 'linear-gradient(135deg, var(--accent), #a29bfe)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{affirmations[affIdx]}</p>
          <button className="btn btn-ghost" onClick={() => setAffIdx((affIdx + 1) % affirmations.length)}>🔄 Lời mới</button>
        </div>
      </div>

      {/* Psychology Tips */}
      <div className="card">
        <div className="card-header"><h2>📚 Nguyên tắc vàng</h2></div>
        {[
          { t: '1. PROCESS > OUTCOME', d: 'Lệnh đúng plan nhưng thua > lệnh sai plan nhưng thắng' },
          { t: '2. CONSISTENCY > PERFECTION', d: '3 lệnh/tuần đúng plan > 10 lệnh lung tung' },
          { t: '3. PATIENCE IS A SKILL', d: 'Chờ đợi = đang LÀM VIỆC' },
          { t: '4. SELF-AWARENESS IS POWER', d: 'Biết mình FOMO = đã thắng 50% FOMO' },
          { t: '5. SMALL WINS COMPOUND', d: 'Kiểm soát 1 lần revenge trade = tiến bộ lớn' },
        ].map(tip => (
          <div key={tip.t} style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, marginBottom: 8 }}>
            <strong>{tip.t}</strong><br />
            <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>{tip.d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
