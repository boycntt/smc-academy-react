import React, { useState, useEffect } from 'react'

const fmt = (n) => (n||0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function TradeCalendar() {
  const [trades, setTrades] = useState([])
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))

  useEffect(() => {
    fetch('/api/journal').then(r => r.json()).then(setTrades).catch(() => setTrades([]))
  }, [])

  const [year, m] = month.split('-').map(Number)
  const daysInMonth = new Date(year, m, 0).getDate()
  const firstDay = new Date(year, m - 1, 1).getDay()

  const dailyData = {}
  trades.forEach(t => {
    if (t.date?.startsWith(month)) {
      if (!dailyData[t.date]) dailyData[t.date] = { trades: 0, pnl: 0, wins: 0, losses: 0 }
      dailyData[t.date].trades++
      dailyData[t.date].pnl += (t.pnl || 0)
      if (t.result === 'WIN') dailyData[t.date].wins++
      if (t.result === 'LOSS') dailyData[t.date].losses++
    }
  })

  const getColor = (pnl) => {
    if (pnl > 100) return 'var(--green)'
    if (pnl > 0) return 'rgba(52,211,153,0.5)'
    if (pnl < -100) return 'var(--red)'
    if (pnl < 0) return 'rgba(248,113,113,0.5)'
    return 'var(--border)'
  }

  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22 }}>📅 Trade Calendar</h2>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          style={{ padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {days.map(d => (
            <div key={d} style={{ textAlign: 'center', padding: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{d}</div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dateStr = `${month}-${String(day).padStart(2, '0')}`
            const data = dailyData[dateStr]
            const pnl = data?.pnl || 0
            const isToday = dateStr === new Date().toISOString().slice(0, 10)
            return (
              <div key={day} style={{
                background: data ? getColor(pnl) : 'var(--bg-secondary)',
                borderRadius: 8,
                padding: '8px 6px',
                minHeight: 70,
                border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
                title={data ? `${dateStr}: ${pnl >= 0 ? '+' : ''}$${fmt(pnl)} (${data.trades} trades)` : dateStr}
              >
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: data ? 'white' : 'var(--text-muted)' }}>{day}</div>
                {data && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.9)' }}>
                    <div>{data.trades}T</div>
                    <div style={{ fontWeight: 600 }}>{pnl >= 0 ? '+' : ''}${fmt(pnl)}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--green)', display: 'inline-block' }} /> Lợi nhuận lớn</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(52,211,153,0.5)', display: 'inline-block' }} /> Lợi nhuận nhỏ</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--border)', display: 'inline-block' }} /> Không giao dịch</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(248,113,113,0.5)', display: 'inline-block' }} /> Lỗ nhỏ</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--red)', display: 'inline-block' }} /> Lỗ lớn</span>
      </div>
    </div>
  )
}
