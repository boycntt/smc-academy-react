import React, { useState, useEffect } from 'react'

const fmt = (n) => (n||0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), pair: '', direction: 'BUY', result: 'RUNNING' })

  const load = () => {
    fetch('/api/journal').then(r => r.json()).then(setEntries).catch(console.error)
  }
  useEffect(load, [])

  const save = async (e) => {
    e.preventDefault()
    await fetch('/api/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setShowForm(false)
    setForm({ date: new Date().toISOString().slice(0,10), pair: '', direction: 'BUY', result: 'RUNNING' })
    load()
  }

  const del = async (id) => {
    if (!confirm('Xóa?')) return
    await fetch(`/api/journal/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22 }}>📓 Nhật ký giao dịch SMC</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Thêm giao dịch</button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Ngày</th><th>Cặp</th><th>Hướng</th><th>Entry</th><th>SL</th><th>TP</th><th>R:R</th><th>Result</th><th>P&L</th><th>Setup</th><th></th></tr></thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 40 }}>Chưa có nhật ký nào</td></tr>
            ) : entries.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td><strong>{t.pair}</strong></td>
                <td><span className={`badge badge-${t.direction === 'BUY' ? 'buy' : 'sell'}`}>{t.direction}</span></td>
                <td>{t.entry_price || '-'}</td>
                <td>{t.sl_price || '-'}</td>
                <td>{t.tp_price || '-'}</td>
                <td>{t.rr_ratio || '-'}</td>
                <td><span className={`badge badge-${t.result === 'WIN' ? 'buy' : t.result === 'LOSS' ? 'sell' : 'deposit'}`}>{t.result}</span></td>
                <td className={t.pnl >= 0 ? 'positive' : 'negative'}>{t.pnl ? `${t.pnl>=0?'+':''}$${fmt(t.pnl)}` : '-'}</td>
                <td>{t.setup_type || ''}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => del(t.id)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal" style={{ width: 500 }}>
            <h3 style={{ marginBottom: 20 }}>📓 Thêm giao dịch</h3>
            <form onSubmit={save}>
              <div className="form-row">
                <div className="form-group"><label>Ngày *</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
                <div className="form-group"><label>Cặp tiền *</label><input type="text" placeholder="EUR/USD" value={form.pair} onChange={e => setForm({...form, pair: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Hướng</label>
                  <select value={form.direction} onChange={e => setForm({...form, direction: e.target.value})}>
                    <option value="BUY">BUY</option><option value="SELL">SELL</option>
                  </select>
                </div>
                <div className="form-group"><label>Entry Price</label><input type="number" step="0.00001" onChange={e => setForm({...form, entry_price: +e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>SL Price</label><input type="number" step="0.00001" onChange={e => setForm({...form, sl_price: +e.target.value})} /></div>
                <div className="form-group"><label>TP Price</label><input type="number" step="0.00001" onChange={e => setForm({...form, tp_price: +e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>R:R</label><input type="number" step="0.1" onChange={e => setForm({...form, rr_ratio: +e.target.value})} /></div>
                <div className="form-group"><label>Lot Size</label><input type="number" step="0.01" onChange={e => setForm({...form, lot_size: +e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Result</label>
                  <select value={form.result} onChange={e => setForm({...form, result: e.target.value})}>
                    <option value="RUNNING">RUNNING</option><option value="WIN">WIN</option><option value="LOSS">LOSS</option><option value="BE">BE</option>
                  </select>
                </div>
                <div className="form-group"><label>P&L ($)</label><input type="number" step="0.01" onChange={e => setForm({...form, pnl: +e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Setup Type</label><input type="text" placeholder="OB Retest / CHoCH / Breakout" onChange={e => setForm({...form, setup_type: e.target.value})} /></div>
              <div className="form-group"><label>Ghi chú</label><textarea rows={2} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
