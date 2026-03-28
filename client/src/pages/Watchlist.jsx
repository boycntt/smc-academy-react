import React, { useState, useEffect } from 'react'

export default function Watchlist() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ pair: '', bias: 'NEUTRAL', h4_trend: '', notes: '' })
  const [showForm, setShowForm] = useState(false)

  const load = () => fetch('/api/watchlist').then(r => r.json()).then(setItems)
  useEffect(load, [])

  const save = async (e) => {
    e.preventDefault()
    await fetch('/api/watchlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setShowForm(false); setForm({ pair: '', bias: 'NEUTRAL', h4_trend: '', notes: '' }); load()
  }

  const del = async (id) => {
    if (!confirm('Xóa?')) return
    await fetch(`/api/watchlist/${id}`, { method: 'DELETE' }); load()
  }

  const biasColor = (b) => b === 'BUY' ? 'var(--green)' : b === 'SELL' ? 'var(--red)' : 'var(--text-dim)'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22 }}>👁️ Watchlist</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Thêm cặp tiền</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {items.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Chưa có cặp tiền nào</div>
        ) : items.map(w => (
          <div key={w.id} className="card">
            <div style={{ fontSize: 18, fontWeight: 700 }}>{w.pair}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>H4: {w.h4_trend || 'N/A'}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: biasColor(w.bias) }}>{w.bias}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 12 }}>{w.notes}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-danger btn-sm" onClick={() => del(w.id)}>✕ Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <h3 style={{ marginBottom: 20 }}>👁️ Thêm vào Watchlist</h3>
            <form onSubmit={save}>
              <div className="form-row">
                <div className="form-group"><label>Cặp tiền *</label><input required placeholder="EUR/USD" value={form.pair} onChange={e => setForm({...form, pair: e.target.value})} /></div>
                <div className="form-group"><label>Bias</label>
                  <select value={form.bias} onChange={e => setForm({...form, bias: e.target.value})}>
                    <option value="NEUTRAL">NEUTRAL</option><option value="BUY">BUY</option><option value="SELL">SELL</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>H4 Trend</label><input placeholder="UP / DOWN / SIDEWAY" value={form.h4_trend} onChange={e => setForm({...form, h4_trend: e.target.value})} /></div>
              <div className="form-group"><label>Ghi chú</label><textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
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
