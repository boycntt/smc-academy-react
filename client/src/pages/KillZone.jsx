import React, { useState, useEffect } from 'react'

const KILL_ZONES = [
  { name: '🔵 Asian KZ', start: 12, end: 14, priority: 'Thấp', color: '#74b9ff' },
  { name: '🟢 London KZ', start: 14, end: 17, priority: 'Cao 🔥', color: '#00b894' },
  { name: '🔴 NY KZ', start: 19, end: 22, priority: 'Cao nhất 🔥🔥', color: '#e17055' },
  { name: '🟡 LDN Close', start: 22, end: 24, priority: 'Trung bình', color: '#fdcb6e' },
]

export default function KillZone() {
  const [now, setNow] = useState(new Date())
  const [checks, setChecks] = useState({})

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const vnHour = (now.getUTCHours() + 7) % 24
  const vnMin = now.getUTCMinutes()
  const currentMin = vnHour * 60 + vnMin

  let currentZone = null
  let nextZone = null
  let minToNext = Infinity

  KILL_ZONES.forEach(kz => {
    const s = kz.start * 60, e = kz.end * 60
    if (currentMin >= s && currentMin < e) currentZone = kz
    let diff = s - currentMin
    if (diff <= 0) diff += 1440
    if (diff < minToNext) { minToNext = diff; nextZone = kz }
  })

  const toggleCheck = (id) => setChecks({ ...checks, [id]: !checks[id] })
  const checkedCount = Object.values(checks).filter(Boolean).length

  const checklistItems = [
    { id: 'trend', label: 'H4 trend rõ ràng?', cat: 'TREND' },
    { id: 'd1', label: 'D1 cùng chiều H4?', cat: 'TREND' },
    { id: 'bias', label: 'Đã ghi bias?', cat: 'TREND' },
    { id: 'ob', label: 'Có OB trên H1?', cat: 'POI' },
    { id: 'obzone', label: 'OB trong Discount/Premium?', cat: 'POI' },
    { id: 'fvg', label: 'Có FVG gần OB?', cat: 'POI' },
    { id: 'idm', label: 'Có IDM?', cat: 'POI' },
    { id: 'sweep', label: 'Liquidity sweep?', cat: 'CONFIRM' },
    { id: 'inst', label: 'Institutional candle?', cat: 'CONFIRM' },
    { id: 'bos', label: 'BOS nhỏ?', cat: 'CONFIRM' },
    { id: 'rr', label: 'R:R ≥ 1:2?', cat: 'RULES' },
    { id: 'risk', label: 'Risk ≤ 2%?', cat: 'RULES' },
    { id: 'max', label: 'Chưa quá 3 lệnh?', cat: 'RULES' },
    { id: 'rev', label: 'Không revenge?', cat: 'RULES' },
  ]

  const grouped = {}
  checklistItems.forEach(item => {
    if (!grouped[item.cat]) grouped[item.cat] = []
    grouped[item.cat].push(item)
  })

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>⏰ Kill Zone Timer (Giờ VN)</h2>

      {/* Current Status */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Giờ hiện tại</div>
          <div className="value">{String(vnHour).padStart(2, '0')}:{String(vnMin).padStart(2, '0')}</div>
        </div>
        <div className="stat-card" style={currentZone ? { borderLeft: `3px solid ${currentZone.color}` } : {}}>
          <div className="label">Kill Zone hiện tại</div>
          <div className="value" style={{ fontSize: 20 }}>{currentZone ? currentZone.name : 'Nghỉ 😴'}</div>
          {currentZone && <div className="sub positive">Đang hoạt động</div>}
        </div>
        <div className="stat-card">
          <div className="label">Kill Zone tiếp theo</div>
          <div className="value" style={{ fontSize: 20 }}>{nextZone?.name || ''}</div>
          <div className="sub">Còn {Math.floor(minToNext / 60)}h {minToNext % 60}p</div>
        </div>
      </div>

      {/* Schedule */}
      <div className="card">
        <div className="card-header"><h2>📊 Lịch Kill Zone</h2></div>
        <table>
          <thead><tr><th>Kill Zone</th><th>Giờ VN</th><th>Thời lượng</th><th>Ưu tiên</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {KILL_ZONES.map(kz => {
              const s = kz.start * 60, e = kz.end * 60
              const active = currentMin >= s && currentMin < e
              const past = currentMin >= e
              return (
                <tr key={kz.name} style={{ background: active ? 'rgba(0,184,148,0.1)' : 'transparent', opacity: past ? 0.5 : 1 }}>
                  <td>{kz.name}</td>
                  <td>{String(kz.start).padStart(2, '0')}:00 - {kz.end === 24 ? '00' : String(kz.end).padStart(2, '0')}:00</td>
                  <td>{kz.end - kz.start} tiếng</td>
                  <td>{kz.priority}</td>
                  <td>
                    <span className={`badge ${active ? 'badge-buy' : past ? 'badge-sell' : 'badge-deposit'}`}>
                      {active ? 'ĐANG HOẠT ĐỘNG' : past ? 'Đã qua' : 'Sắp tới'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Checklist */}
      <div className="card">
        <div className="card-header">
          <h2>📋 Checklist trước mỗi Kill Zone</h2>
          <span style={{ fontSize: 18, fontWeight: 700, color: checkedCount === 14 ? 'var(--green)' : checkedCount >= 10 ? 'var(--orange)' : 'var(--red)' }}>
            {checkedCount}/14
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h3 style={{ color: 'var(--accent-light)', fontSize: 13, marginBottom: 8 }}>{cat}</h3>
              {items.map(item => (
                <label key={item.id} style={{ display: 'block', padding: '6px 0', fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!checks[item.id]} onChange={() => toggleCheck(item.id)} style={{ marginRight: 8 }} />
                  {item.label}
                </label>
              ))}
            </div>
          ))}
        </div>
        {checkedCount === 14 && (
          <div style={{ textAlign: 'center', marginTop: 16, padding: 12, background: 'rgba(0,184,148,0.1)', borderRadius: 8, color: 'var(--green)', fontWeight: 700 }}>
            ✅ SẴN SÀNG TRADE! 14/14 hoàn thành
          </div>
        )}
      </div>
    </div>
  )
}
