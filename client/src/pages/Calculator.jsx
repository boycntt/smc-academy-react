import React, { useState } from 'react'

export default function Calculator() {
  const [balance, setBalance] = useState(10000)
  const [riskPct, setRiskPct] = useState(1)
  const [slPips, setSlPips] = useState(20)
  const [pipValue, setPipValue] = useState(0.10)

  const riskAmount = balance * riskPct / 100
  const lotSize = slPips > 0 ? riskAmount / (slPips * pipValue * 100) : 0

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>🧮 Risk & Pip Calculator</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
              <option value={10.00}>XAU/USD (Gold)</option>
            </select>
          </div>
          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div className="label">Risk Amount</div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--red)' }}>${riskAmount.toFixed(2)}</div></div>
            <div><div className="label">Lot Size</div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-light)' }}>{lotSize.toFixed(2)}</div></div>
            <div><div className="label">TP1 (1R)</div><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--green)' }}>+${riskAmount.toFixed(0)}</div></div>
            <div><div className="label">TP2 (2R)</div><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--green)' }}>+${(riskAmount * 2).toFixed(0)}</div></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>📊 Quick Reference (0.01 lot)</h2></div>
          <table>
            <thead><tr><th>Pair</th><th>Pip Value</th><th>10 pips</th><th>20 pips</th><th>50 pips</th></tr></thead>
            <tbody>
              <tr><td>EUR/USD</td><td>$0.10</td><td>$1</td><td>$2</td><td>$5</td></tr>
              <tr><td>GBP/USD</td><td>$0.10</td><td>$1</td><td>$2</td><td>$5</td></tr>
              <tr><td>USD/JPY</td><td>$0.10</td><td>$1</td><td>$2</td><td>$5</td></tr>
              <tr><td>XAU/USD</td><td>$10.00</td><td>$100</td><td>$200</td><td>$500</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
