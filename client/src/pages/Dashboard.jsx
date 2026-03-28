import React, { useState, useEffect } from 'react'

const fmt = (n) => (n||0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(console.error)
  }, [])

  if (!stats) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>Đang tải...</div>

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>📈 Tổng quan</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Tổng số dư</div>
          <div className="value">${fmt(stats.totalBalance)}</div>
          <div className="sub" style={{ color: 'var(--text-dim)' }}>{stats.totalAccounts} tài khoản</div>
        </div>
        <div className="stat-card">
          <div className="label">P&L hôm nay</div>
          <div className={`value ${stats.todayPL >= 0 ? 'positive' : 'negative'}`}>
            {stats.todayPL >= 0 ? '+' : ''}${fmt(stats.todayPL)}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">P&L tháng này</div>
          <div className={`value ${stats.monthPL >= 0 ? 'positive' : 'negative'}`}>
            {stats.monthPL >= 0 ? '+' : ''}${fmt(stats.monthPL)}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Win Rate</div>
          <div className={`value ${parseFloat(stats.winRate) >= 50 ? 'positive' : 'negative'}`}>
            {stats.winRate}%
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Tổng giao dịch</div>
          <div className="value">{stats.tradeCount}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header"><h2>💹 P&L theo ngày (30 ngày)</h2></div>
        <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, padding: '16px 0' }}>
          {stats.dailyPL.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-dim)' }}>Chưa có dữ liệu</div>
          ) : (
            stats.dailyPL.map((d, i) => {
              const maxAbs = Math.max(...stats.dailyPL.map(x => Math.abs(x.pl)), 1)
              const h = Math.max((Math.abs(d.pl) / maxAbs) * 160, 4)
              const color = d.pl >= 0 ? 'var(--green)' : 'var(--red)'
              return <div key={i} style={{ flex: 1, height: h, background: color, borderRadius: '3px 3px 0 0', minWidth: 4, cursor: 'pointer' }} title={`${d.date}: ${d.pl>=0?'+':''}$${fmt(d.pl)}`} />
            })
          )}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 14 }}>
        SMC Academy v3.0 — React + Node.js 🚀
      </div>
    </div>
  )
}
