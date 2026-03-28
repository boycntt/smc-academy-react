import React, { useState, useEffect } from 'react'

const lessons = [
  { id: 1, title: '📚 Bài 1: Market Structure', content: 'Hiểu 3 trạng thái: Uptrend (HH+HL), Downtrend (LH+LL), Sideway. Phân biệt Internal vs External structure.' },
  { id: 2, title: '📊 Bài 2: BOS & CHoCH', content: 'BOS = phá đỉnh/đáy → trend tiếp tục. CHoCH = phá cấu trúc ngược → đảo chiều.' },
  { id: 3, title: '📦 Bài 3: Order Block', content: 'Nến cuối ngược màu trước impulse. 3 loại: Reversal ★★★★★, Continuation ★★★★, Breaker ★★★.' },
  { id: 4, title: '📐 Bài 4: FVG', content: 'Khoảng trống giữa nến 1 và 3. Giá bị hút về lấp. FVG + OB = setup mạnh nhất.' },
  { id: 5, title: '💧 Bài 5: Liquidity', content: '5 loại: BSL, SSL, Trendline, Double Top/Bottom, Session. BẮT BUỘC có sweep trước entry.' },
  { id: 6, title: '🪤 Bài 6: Inducement (IDM)', content: 'Swing nhỏ dụ trader. Có IDM = setup mạnh hơn. Trading Hub 3.0: IDM bắt buộc.' },
  { id: 7, title: '💰 Bài 7: Premium/Discount & OTE', content: 'BUY ở Discount (<50%), SELL ở Premium (>50%). OTE = 62-79% Fib.' },
  { id: 8, title: '⏰ Bài 8: Kill Zone', content: 'London KZ: 14-17h VN. NY KZ: 19-22h VN. Chỉ trade trong Kill Zone.' },
  { id: 9, title: '🎯 Bài 9: Full Setup', content: '7 bước: Trend → POI → Confirm 4/4 → Entry trong Kill Zone → SL/TP.' },
  { id: 10, title: '🛡️ Bài 10: Risk Management', content: 'Risk 1-2%, R:R ≥ 1:2, Max 3 lệnh/ngày, 2 lệnh thua = nghỉ.' },
  { id: 11, title: '📋 Bài 11: Trading Plan', content: 'Checklist 10 điểm. 10/10 = vào lệnh. Dưới 10 = không vào.' },
  { id: 12, title: '🔬 Bài 12: Practice', content: 'Phase 1: Paper 100 lệnh. Phase 2: Live 0.01 lot. Phase 3: Tăng size.' },
]

export default function SMCLearn() {
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('smc_lessons') || '{}'))
  const [expanded, setExpanded] = useState({})

  const complete = (id) => {
    const updated = { ...completed, [id]: true }
    setCompleted(updated)
    localStorage.setItem('smc_lessons', JSON.stringify(updated))
  }

  const pct = Math.round((Object.keys(completed).length / lessons.length) * 100)

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>🎓 Học Smart Money Concepts</h2>

      <div className="card" style={{ background: 'linear-gradient(135deg, var(--accent), #a29bfe)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div><div style={{ opacity: 0.8 }}>Tiến độ</div><div style={{ fontSize: 32, fontWeight: 700 }}>{pct}%</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ opacity: 0.8 }}>Hoàn thành</div><div style={{ fontSize: 24, fontWeight: 700 }}>{Object.keys(completed).length}/{lessons.length}</div></div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 8, marginTop: 12 }}>
          <div style={{ background: 'white', height: 8, borderRadius: 10, width: `${pct}%`, transition: 'width 0.5s' }} />
        </div>
      </div>

      {lessons.map(l => (
        <div key={l.id} className="card">
          <div className="card-header" onClick={() => setExpanded({ ...expanded, [l.id]: !expanded[l.id] })}>
            <h2>{l.title}</h2>
            <span className={`badge ${completed[l.id] ? 'badge-buy' : 'badge-deposit'}`}>
              {completed[l.id] ? '✅ Hoàn thành' : 'Chưa học'}
            </span>
          </div>
          {expanded[l.id] && (
            <div>
              <p style={{ marginBottom: 12 }}>{l.content}</p>
              {!completed[l.id] && <button className="btn btn-primary" onClick={() => complete(l.id)}>✅ Đã hiểu — Hoàn thành</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
