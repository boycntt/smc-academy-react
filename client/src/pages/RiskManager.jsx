import React, { useState } from 'react'

const fmt = (n) => (n||0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function RiskManager() {
  const [balance, setBalance] = useState(10000)
  const [riskPct, setRiskPct] = useState(1)
  const [slPips, setSlPips] = useState(20)
  const [pipValue, setPipValue] = useState(0.10)
  const [maxDaily, setMaxDaily] = useState(3)
  const [weeklyTarget, setWeeklyTarget] = useState(5)

  const riskAmount = balance * riskPct / 100
  const lotSize = slPips > 0 ? riskAmount / (slPips * pipValue * 100) : 0
  const maxDailyLoss = balance * 5 / 100
  const weeklyTargetAmount = balance * weeklyTarget / 100

  const rules = [
    { rule: 'Risk mỗi lệnh', value: `${riskPct}% = $${fmt(riskAmount)}`, status: riskPct <= 2 },
    { rule: 'R:R tối thiểu', value: '1:2', status: true },
    { rule: 'Max lệnh/ngày', value: `${maxDaily} lệnh`, status: maxDaily <= 3 },
    { rule: 'Max drawdown', value: '10% → dừng', status: true },
    { rule: '2 lệnh thua liên tiếp', value: 'Nghỉ trong ngày', status: true },
    { rule: 'Đạt +2% ngày', value: 'Dừng ngày', status: true },
    { rule: 'Thua -5% tuần', value: 'Dừng tuần', status: true },
    { rule: 'Không revenge trade', value: 'Nghỉ 30 phút', status: true },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>🛡️ Risk Manager</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Calculator */}
        <div className="card">
          <div className="card-header"><h2>💰 Risk Calculator</h2></div>
          <div className="form-group"><label>Account Balance ($)</label><input type="number" value={balance} onChange={e => setBalance(+e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>Risk %</label><input type="number" step="0.1" value={riskPct} onChange={e => setRiskPct(+e.target.value)} /></div>
            <div className="form-group"><label>SL (pips)</label><input type="number" value={slPips} onChange={e => setSlPips(+e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Pair</label>
            <select onChange={e => setPipValue(+e.target.value)}>
              <option value={0.10}>EUR/USD, GBP/USD, USD/JPY</option>
              <option value={0.13}>USD/CAD</option>
              <option value={10.00}>XAU/USD (Gold)</option>
            </select>
          </div>

          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div className="label">Risk Amount</div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--red)' }}>${fmt(riskAmount)}</div></div>
            <div><div className="label">Lot Size</div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-light)' }}>{lotSize.toFixed(2)}</div></div>
            <div><div className="label">TP1 (1R)</div><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--green)' }}>+${fmt(riskAmount)}</div></div>
            <div><div className="label">TP2 (2R)</div><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--green)' }}>+${fmt(riskAmount * 2)}</div></div>
          </div>
        </div>

        {/* Rules */}
        <div className="card">
          <div className="card-header"><h2>📋 Quy tắc quản lý vốn</h2></div>
          <table>
            <thead><tr><th>Quy tắc</th><th>Giá trị</th><th>✓</th></tr></thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={i}>
                  <td>{r.rule}</td>
                  <td style={{ fontWeight: 600 }}>{r.value}</td>
                  <td style={{ color: r.status ? 'var(--green)' : 'var(--red)', fontSize: 18 }}>{r.status ? '✅' : '⚠️'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Daily Limits */}
        <div className="card">
          <div className="card-header"><h2>⏰ Giới hạn hàng ngày</h2></div>
          <div className="form-row">
            <div className="form-group"><label>Max lệnh/ngày</label><input type="number" value={maxDaily} onChange={e => setMaxDaily(+e.target.value)} /></div>
            <div className="form-group"><label>Mục tiêu tuần (%)</label><input type="number" value={weeklyTarget} onChange={e => setWeeklyTarget(+e.target.value)} /></div>
          </div>
          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div className="label">Max loss/ngày</div><div style={{ fontSize: 18, fontWeight: 700, color: 'var(--red)' }}>${fmt(maxDailyLoss)}</div></div>
              <div><div className="label">Mục tiêu tuần</div><div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>${fmt(weeklyTargetAmount)}</div></div>
              <div><div className="label">Max lệnh/tuần</div><div style={{ fontSize: 18, fontWeight: 700 }}>{maxDaily * 5}</div></div>
              <div><div className="label">Risk/lệnh TB</div><div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-light)' }}>{riskPct}%</div></div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="card">
          <div className="card-header"><h2>📊 Pip Value (0.01 lot)</h2></div>
          <table>
            <thead><tr><th>Pair</th><th>Pip Value</th><th>10 pips</th><th>20 pips</th><th>50 pips</th></tr></thead>
            <tbody>
              {[['EUR/USD', 0.10], ['GBP/USD', 0.10], ['USD/JPY', 0.10], ['XAU/USD', 10.00]].map(([pair, pv]) => (
                <tr key={pair}><td><strong>{pair}</strong></td><td>${pv}</td><td>${pv*10}</td><td>${pv*20}</td><td>${pv*50}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
