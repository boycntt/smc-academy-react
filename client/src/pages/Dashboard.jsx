import React, { useState, useEffect } from 'react'

const fmt = (n) => (n||0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() =>
      setStats({ totalAccounts: 0, totalBalance: 0, todayPL: 0, monthPL: 0, tradeCount: 0, winRate: 0, dailyPL: [] })
    )
  }, [])

  if (!stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <div>Đang tải...</div>
      </div>
    </div>
  )

  const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="label">{label}</div>
          <div className="value" style={color ? { color } : {}}>{value}</div>
          {sub && <div className="sub">{sub}</div>}
        </div>
        <div style={{ fontSize: 24, opacity: 0.6 }}>{icon}</div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Tổng quan</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/journal'}>
          + Thêm giao dịch
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon="💰"
          label="Tổng số dư"
          value={`$${fmt(stats.totalBalance)}`}
          sub={`${stats.totalAccounts} tài khoản`}
        />
        <StatCard
          icon={stats.todayPL >= 0 ? '📈' : '📉'}
          label="P&L hôm nay"
          value={`${stats.todayPL >= 0 ? '+' : ''}$${fmt(stats.todayPL)}`}
          color={stats.todayPL >= 0 ? 'var(--green)' : 'var(--red)'}
        />
        <StatCard
          icon="📅"
          label="P&L tháng này"
          value={`${stats.monthPL >= 0 ? '+' : ''}$${fmt(stats.monthPL)}`}
          color={stats.monthPL >= 0 ? 'var(--green)' : 'var(--red)'}
        />
        <StatCard
          icon="🎯"
          label="Win Rate"
          value={`${stats.winRate}%`}
          color={parseFloat(stats.winRate) >= 50 ? 'var(--green)' : 'var(--red)'}
        />
        <StatCard
          icon="📊"
          label="Tổng giao dịch"
          value={stats.tradeCount}
        />
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <h2>💹 P&L — 30 ngày gần nhất</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {stats.dailyPL.length} ngày có giao dịch
          </span>
        </div>
        <div style={{
          height: 220,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 3,
          padding: '16px 0',
          borderBottom: '1px solid var(--border)',
          position: 'relative'
        }}>
          {/* Zero line */}
          <div style={{
            position: 'absolute', bottom: '50%', left: 0, right: 0,
            height: 1, background: 'var(--border-light)',
            zIndex: 0
          }} />
          {stats.dailyPL.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-muted)', alignSelf: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              Chưa có dữ liệu giao dịch
            </div>
          ) : (
            stats.dailyPL.map((d, i) => {
              const maxAbs = Math.max(...stats.dailyPL.map(x => Math.abs(x.pl)), 1)
              const h = Math.max((Math.abs(d.pl) / maxAbs) * 90, 3)
              const isPositive = d.pl >= 0
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background: isPositive
                      ? 'linear-gradient(180deg, var(--green), rgba(52,211,153,0.5))'
                      : 'linear-gradient(180deg, var(--red), rgba(248,113,113,0.5))',
                    borderRadius: '4px 4px 0 0',
                    minWidth: 6,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    position: 'relative',
                    zIndex: 1,
                    alignSelf: isPositive ? 'flex-end' : 'flex-start',
                    marginTop: isPositive ? 'auto' : 0,
                    marginBottom: isPositive ? 0 : 'auto',
                  }}
                  title={`${d.date}: ${d.pl >= 0 ? '+' : ''}$${fmt(d.pl)}`}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
        {[
          { icon: '📓', label: 'Thêm nhật ký', path: '/journal' },
          { icon: '⏰', label: 'Kill Zone', path: '/killzone' },
          { icon: '🎯', label: 'Xem Patterns', path: '/patterns' },
          { icon: '📊', label: 'Analytics', path: '/analytics' },
        ].map(item => (
          <a
            key={item.path}
            href={item.path}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', background: 'var(--card)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              textDecoration: 'none', color: 'var(--text)',
              transition: 'var(--transition)', cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.background = 'var(--accent-glow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--card)'
            }}
          >
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span style={{ fontWeight: 600 }}>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
