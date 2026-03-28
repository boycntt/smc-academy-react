import React, { useState, useEffect } from 'react'

const fmt = (n) => (n||0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Analytics() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/journal-stats').then(r => r.json()).then(setStats).catch(() => setStats({ total: 0, wins: 0, losses: 0, be: 0, winRate: 0, pnl: 0, avgRR: '0', byPair: [], dailyPnl: [] }))
  }, [])

  if (!stats) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>Đang tải...</div>

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>📈 Analytics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total P&L</div>
          <div className={`value ${stats.pnl >= 0 ? 'positive' : 'negative'}`}>{stats.pnl >= 0 ? '+' : ''}${fmt(stats.pnl)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Win Rate</div>
          <div className={`value ${parseFloat(stats.winRate) >= 50 ? 'positive' : 'negative'}`}>{stats.winRate}%</div>
          <div className="sub">{stats.wins}W / {stats.losses}L / {stats.be}BE</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Trades</div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="label">Avg R:R</div>
          <div className="value">{stats.avgRR}</div>
        </div>
      </div>

      {/* Equity Curve */}
      <div className="card">
        <div className="card-header"><h2>💹 Equity Curve (30 ngày)</h2></div>
        <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, padding: '16px 0' }}>
          {stats.dailyPnl.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-dim)' }}>Chưa có dữ liệu</div>
          ) : (
            stats.dailyPnl.map((d, i) => {
              const maxAbs = Math.max(...stats.dailyPnl.map(x => Math.abs(x.pnl)), 1)
              const h = Math.max((Math.abs(d.pnl) / maxAbs) * 160, 4)
              return <div key={i} style={{ flex: 1, height: h, background: d.pnl >= 0 ? 'var(--green)' : 'var(--red)', borderRadius: '3px 3px 0 0', minWidth: 4, cursor: 'pointer' }} title={`${d.date}: ${d.pnl>=0?'+':''}$${fmt(d.pnl)}`} />
            })
          )}
        </div>
      </div>

      {/* By Pair */}
      <div className="card">
        <div className="card-header"><h2>📊 Performance by Pair</h2></div>
        <table>
          <thead><tr><th>Pair</th><th>Trades</th><th>P&L</th><th>Win Rate</th></tr></thead>
          <tbody>
            {stats.byPair.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No data</td></tr>
            ) : stats.byPair.map(p => {
              const wr = p.cnt > 0 ? ((p.w / p.cnt) * 100).toFixed(0) : 0
              return (
                <tr key={p.pair}>
                  <td><strong>{p.pair}</strong></td>
                  <td>{p.cnt}</td>
                  <td className={p.tpnl >= 0 ? 'positive' : 'negative'}>{p.tpnl >= 0 ? '+' : ''}${fmt(p.tpnl)}</td>
                  <td>{wr}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Trade Calendar */}
      <div className="card">
        <div className="card-header"><h2>📅 Trade Calendar (60 ngày)</h2></div>
        <div id="trade-calendar" style={{ display: 'flex', flexWrap: 'wrap', gap: 3, padding: '8px 0' }}>
          {Array.from({ length: 60 }, (_, i) => {
            const d = new Date(); d.setDate(d.getDate() - 59 + i)
            const dateStr = d.toISOString().slice(0, 10)
            const pnl = stats.dailyPnl.find(x => x.date === dateStr)?.pnl || 0
            let bg = 'var(--border)'
            if (pnl > 50) bg = '#00b894'
            else if (pnl > 0) bg = '#55efc4'
            else if (pnl < -50) bg = '#e17055'
            else if (pnl < 0) bg = '#fab1a0'
            return <div key={i} style={{ width: 16, height: 16, borderRadius: 3, background: bg, cursor: 'pointer' }} title={`${dateStr}: ${pnl >= 0 ? '+' : ''}$${fmt(pnl)}`} />
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 11, color: 'var(--text-dim)' }}>
          <span>🔴 Loss</span><span>⚪ No trade</span><span>🟢 Win</span>
        </div>
      </div>
    </div>
  )
}
