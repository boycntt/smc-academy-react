import React, { useState } from 'react'

export default function Backtest() {
  const [results, setResults] = useState([])
  const [form, setForm] = useState({ pair: 'EUR/USD', timeframe: 'H1', period: '30', strategy: 'OB Retest' })

  const runBacktest = () => {
    // Simulated backtest results
    const mockResults = [
      { date: '2026-03-01', pair: form.pair, direction: 'BUY', entry: 1.0850, sl: 1.0820, tp: 1.0910, result: 'WIN', pnl: 60, rr: 2 },
      { date: '2026-03-03', pair: form.pair, direction: 'SELL', entry: 1.0900, sl: 1.0935, tp: 1.0830, result: 'WIN', pnl: 70, rr: 2 },
      { date: '2026-03-05', pair: form.pair, direction: 'BUY', entry: 1.0840, sl: 1.0810, tp: 1.0900, result: 'LOSS', pnl: -30, rr: -1 },
      { date: '2026-03-07', pair: form.pair, direction: 'BUY', entry: 1.0860, sl: 1.0830, tp: 1.0920, result: 'WIN', pnl: 60, rr: 2 },
      { date: '2026-03-10', pair: form.pair, direction: 'SELL', entry: 1.0910, sl: 1.0940, tp: 1.0850, result: 'WIN', pnl: 60, rr: 2 },
      { date: '2026-03-12', pair: form.pair, direction: 'BUY', entry: 1.0830, sl: 1.0800, tp: 1.0890, result: 'LOSS', pnl: -30, rr: -1 },
      { date: '2026-03-15', pair: form.pair, direction: 'SELL', entry: 1.0880, sl: 1.0910, tp: 1.0820, result: 'WIN', pnl: 60, rr: 2 },
      { date: '2026-03-18', pair: form.pair, direction: 'BUY', entry: 1.0850, sl: 1.0820, tp: 1.0910, result: 'WIN', pnl: 60, rr: 2 },
    ]
    setResults(mockResults)
  }

  const wins = results.filter(r => r.result === 'WIN').length
  const losses = results.filter(r => r.result === 'LOSS').length
  const totalPnl = results.reduce((s, r) => s + r.pnl, 0)
  const winRate = results.length > 0 ? ((wins / results.length) * 100).toFixed(1) : 0

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>🔬 Backtest</h2>

      <div className="card">
        <div className="card-header"><h2>⚙️ Cấu hình Backtest</h2></div>
        <div className="form-row">
          <div className="form-group"><label>Cặp tiền</label>
            <select value={form.pair} onChange={e => setForm({...form, pair: e.target.value})}>
              <option>EUR/USD</option><option>GBP/USD</option><option>USD/JPY</option><option>XAU/USD</option>
            </select>
          </div>
          <div className="form-group"><label>Timeframe</label>
            <select value={form.timeframe} onChange={e => setForm({...form, timeframe: e.target.value})}>
              <option>M15</option><option>H1</option><option>H4</option><option>D1</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Chiến lược</label>
            <select value={form.strategy} onChange={e => setForm({...form, strategy: e.target.value})}>
              <option>OB Retest</option><option>CHoCH + OB</option><option>Kill Zone Reversal</option>
              <option>Trend Continuation</option><option>FVG Fill</option>
            </select>
          </div>
          <div className="form-group"><label>Thời gian (ngày)</label>
            <input type="number" value={form.period} onChange={e => setForm({...form, period: e.target.value})} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={runBacktest}>🔬 Chạy Backtest</button>
      </div>

      {results.length > 0 && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="label">Tổng lệnh</div>
              <div className="value">{results.length}</div>
              <div className="sub">{wins}W / {losses}L</div>
            </div>
            <div className="stat-card">
              <div className="label">Win Rate</div>
              <div className={`value ${parseFloat(winRate) >= 50 ? 'positive' : 'negative'}`}>{winRate}%</div>
            </div>
            <div className="stat-card">
              <div className="label">Total P&L</div>
              <div className={`value ${totalPnl >= 0 ? 'positive' : 'negative'}`}>{totalPnl >= 0 ? '+' : ''}{totalPnl} pips</div>
            </div>
            <div className="stat-card">
              <div className="label">Avg R:R</div>
              <div className="value">{(results.reduce((s, r) => s + Math.abs(r.rr), 0) / results.length).toFixed(1)}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>📊 Kết quả Backtest</h2></div>
            <table>
              <thead><tr><th>Ngày</th><th>Cặp</th><th>Hướng</th><th>Entry</th><th>SL</th><th>TP</th><th>Result</th><th>P&L</th><th>R:R</th></tr></thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td><strong>{r.pair}</strong></td>
                    <td><span className={`badge badge-${r.direction === 'BUY' ? 'buy' : 'sell'}`}>{r.direction}</span></td>
                    <td>{r.entry}</td>
                    <td>{r.sl}</td>
                    <td>{r.tp}</td>
                    <td><span className={`badge badge-${r.result === 'WIN' ? 'buy' : 'sell'}`}>{r.result}</span></td>
                    <td className={r.pnl >= 0 ? 'positive' : 'negative'}>{r.pnl >= 0 ? '+' : ''}{r.pnl}</td>
                    <td>{r.rr}R</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
