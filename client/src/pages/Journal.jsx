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
          <thead><tr><th>Ngày</th><th>Cặp</th><th>TF</th><th>Hướng</th><th>Session</th><th>Setup</th><th>Confirm</th><th>R:R</th><th>Result</th><th>P&L</th><th></th></tr></thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 40 }}>Chưa có nhật ký nào</td></tr>
            ) : entries.map(t => {
              const confCount = (t.checklist || '').split(',').filter(Boolean).length
              return (
                <tr key={t.id}>
                  <td>{t.date}<br/><span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{t.time || ''}</span></td>
                  <td><strong>{t.pair}</strong></td>
                  <td>{t.timeframe || '-'}</td>
                  <td><span className={`badge badge-${t.direction === 'BUY' ? 'buy' : 'sell'}`}>{t.direction}</span></td>
                  <td><span style={{ fontSize: 12 }}>{t.session === 'NY' ? '🔴' : t.session === 'London' ? '🟢' : t.session === 'Asian' ? '🔵' : '🟡'} {t.session || ''}</span></td>
                  <td style={{ fontSize: 12 }}>{t.setup_type || '-'}</td>
                  <td><span style={{ color: confCount >= 8 ? 'var(--green)' : confCount >= 5 ? 'var(--orange)' : 'var(--red)', fontWeight: 600 }}>{confCount}/10</span></td>
                  <td>{t.rr_ratio || '-'}</td>
                  <td><span className={`badge badge-${t.result === 'WIN' ? 'buy' : t.result === 'LOSS' ? 'sell' : 'deposit'}`}>{t.result}</span></td>
                  <td className={t.pnl >= 0 ? 'positive' : 'negative'}>{t.pnl ? `${t.pnl>=0?'+':''}$${fmt(t.pnl)}` : '-'}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => del(t.id)}>✕</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: 20 }}>📓 Thêm giao dịch SMC</h3>
            <form onSubmit={save}>
              {/* Basic Info */}
              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--accent-light)', marginBottom: 8, fontWeight: 600 }}>📊 THÔNG TIN CƠ BẢN</div>
                <div className="form-row">
                  <div className="form-group"><label>Ngày *</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
                  <div className="form-group"><label>Giờ</label><input type="time" value={form.time || ''} onChange={e => setForm({...form, time: e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Cặp tiền *</label><input type="text" placeholder="EUR/USD" value={form.pair} onChange={e => setForm({...form, pair: e.target.value})} required /></div>
                  <div className="form-group"><label>Timeframe</label>
                    <select value={form.timeframe || 'M5'} onChange={e => setForm({...form, timeframe: e.target.value})}>
                      <option value="M1">M1</option><option value="M5">M5</option><option value="M15">M15</option>
                      <option value="M30">M30</option><option value="H1">H1</option><option value="H4">H4</option><option value="D1">D1</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Hướng *</label>
                    <select value={form.direction} onChange={e => setForm({...form, direction: e.target.value})}>
                      <option value="BUY">BUY 🟢</option><option value="SELL">SELL 🔴</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Session</label>
                    <select value={form.session || 'London'} onChange={e => setForm({...form, session: e.target.value})}>
                      <option value="Asian">🔵 Asian (12-14h VN)</option>
                      <option value="London">🟢 London (14-17h VN)</option>
                      <option value="NY">🔴 NY (19-22h VN)</option>
                      <option value="LDN Close">🟡 LDN Close (22-00h VN)</option>
                      <option value="Other">⚪ Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SMC Strategy */}
              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--accent-light)', marginBottom: 8, fontWeight: 600 }}>🎯 CHIẾN LƯỢC SMC</div>
                <div className="form-group"><label>Setup Type</label>
                  <select value={form.setup_type || ''} onChange={e => setForm({...form, setup_type: e.target.value})}>
                    <option value="">-- Chọn setup --</option>
                    <option value="OB Retest">📦 OB Retest (pullback về OB)</option>
                    <option value="CHoCH + OB">🔄 CHoCH + OB (đảo chiều)</option>
                    <option value="Breakout Retest">🚀 Breakout Retest</option>
                    <option value="Kill Zone Reversal">⏰ Kill Zone Reversal</option>
                    <option value="Trend Continuation">📈 Trend Continuation</option>
                    <option value="Asian Breakout">🔵 Asian Breakout</option>
                    <option value="FVG Fill">📐 FVG Fill (lấp gap)</option>
                    <option value="Breaker Block">🔨 Breaker Block</option>
                    <option value="Liquidity Sweep">💧 Liquidity Sweep</option>
                  </select>
                </div>

                {/* SMC Checklist */}
                <div className="form-group">
                  <label>SMC Checklist (tick các confirm đã có)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 13, background: 'var(--card)', padding: 12, borderRadius: 8 }}>
                    {[
                      { id: 'trend', label: '□ Trend D1/H4' },
                      { id: 'ob_zone', label: '□ OB trong zone' },
                      { id: 'fvg', label: '□ FVG có' },
                      { id: 'idm', label: '□ IDM có' },
                      { id: 'sweep', label: '□ Sweep đã xảy ra' },
                      { id: 'institutional', label: '□ Institutional candle' },
                      { id: 'bos', label: '□ BOS nhỏ' },
                      { id: 'killzone', label: '□ Trong Kill Zone' },
                      { id: 'rr', label: '□ R:R ≥ 1:2' },
                      { id: 'risk', label: '□ Risk ≤ 2%' },
                    ].map(item => {
                      const checks = (form.checklist || '').split(',').filter(Boolean)
                      const isChecked = checks.includes(item.id)
                      return (
                        <label key={item.id} style={{ cursor: 'pointer', padding: '4px 0' }}
                          onClick={() => {
                            const newChecks = isChecked ? checks.filter(c => c !== item.id) : [...checks, item.id]
                            setForm({ ...form, checklist: newChecks.join(',') })
                          }}>
                          <span style={{ color: isChecked ? 'var(--green)' : 'var(--text-dim)' }}>
                            {isChecked ? '✅' : '□'} {item.label.replace('□ ', '')}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                    {(form.checklist || '').split(',').filter(Boolean).length}/10 confirm
                  </div>
                </div>
              </div>

              {/* Price & Risk */}
              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--accent-light)', marginBottom: 8, fontWeight: 600 }}>💰 GIÁ & RỦI RO</div>
                <div className="form-row">
                  <div className="form-group"><label>Entry Price</label><input type="number" step="0.00001" value={form.entry_price || ''} onChange={e => setForm({...form, entry_price: +e.target.value})} /></div>
                  <div className="form-group"><label>SL Price</label><input type="number" step="0.00001" value={form.sl_price || ''} onChange={e => setForm({...form, sl_price: +e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>TP Price</label><input type="number" step="0.00001" value={form.tp_price || ''} onChange={e => setForm({...form, tp_price: +e.target.value})} /></div>
                  <div className="form-group"><label>R:R Ratio</label><input type="number" step="0.1" value={form.rr_ratio || ''} onChange={e => setForm({...form, rr_ratio: +e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>SL (pips)</label><input type="number" value={form.sl_pips || ''} onChange={e => setForm({...form, sl_pips: +e.target.value})} /></div>
                  <div className="form-group"><label>TP (pips)</label><input type="number" value={form.tp_pips || ''} onChange={e => setForm({...form, tp_pips: +e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Lot Size</label><input type="number" step="0.01" value={form.lot_size || ''} onChange={e => setForm({...form, lot_size: +e.target.value})} /></div>
                  <div className="form-group"><label>Risk %</label><input type="number" step="0.1" value={form.risk_percent || ''} onChange={e => setForm({...form, risk_percent: +e.target.value})} /></div>
                </div>
              </div>

              {/* Result */}
              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--accent-light)', marginBottom: 8, fontWeight: 600 }}>📊 KẾT QUẢ</div>
                <div className="form-row">
                  <div className="form-group"><label>Result</label>
                    <select value={form.result} onChange={e => setForm({...form, result: e.target.value})}>
                      <option value="RUNNING">⏳ RUNNING</option>
                      <option value="WIN">✅ WIN</option>
                      <option value="LOSS">❌ LOSS</option>
                      <option value="BE">⚪ BE (Breakeven)</option>
                    </select>
                  </div>
                  <div className="form-group"><label>P&L ($)</label><input type="number" step="0.01" value={form.pnl || ''} onChange={e => setForm({...form, pnl: +e.target.value})} /></div>
                </div>
              </div>

              {/* Psychology */}
              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--accent-light)', marginBottom: 8, fontWeight: 600 }}>🧠 TÂM LÝ & BÀI HỌC</div>
                <div className="form-group"><label>Cảm xúc khi trade</label>
                  <select value={form.emotions || ''} onChange={e => setForm({...form, emotions: e.target.value})}>
                    <option value="">-- Chọn --</option>
                    <option value="Tự tin">😎 Tự tin</option>
                    <option value="Bình tĩnh">😌 Bình tĩnh</option>
                    <option value="Lo lắng">😰 Lo lắng</option>
                    <option value="FOMO">🤑 FOMO</option>
                    <option value="Revenge">😤 Muốn gỡ</option>
                    <option value="Mệt mỏi">😴 Mệt mỏi</option>
                  </select>
                </div>
                <div className="form-group"><label>Ghi chú</label><textarea rows={2} value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Chi tiết setup..." /></div>
                <div className="form-group"><label>Bài học rút ra</label><textarea rows={2} value={form.lessons || ''} onChange={e => setForm({...form, lessons: e.target.value})} placeholder="Lần sau cần..." /></div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">💾 Lưu giao dịch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
