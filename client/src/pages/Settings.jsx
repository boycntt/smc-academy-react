import React, { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('smc_settings') || '{}'))

  const save = () => {
    localStorage.setItem('smc_settings', JSON.stringify(settings))
    alert('✅ Đã lưu cài đặt!')
  }

  const exportData = async () => {
    const [journal, watchlist, reviews] = await Promise.all([
      fetch('/api/journal').then(r => r.json()),
      fetch('/api/watchlist').then(r => r.json()),
    ])
    const data = { journal, watchlist, settings, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `smc-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = '.json'
    input.onchange = async (e) => {
      const text = await e.target.files[0].text()
      const data = JSON.parse(text)
      if (data.journal?.length) for (const t of data.journal) {
        await fetch('/api/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) })
      }
      if (data.watchlist?.length) for (const w of data.watchlist) {
        await fetch('/api/watchlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(w) })
      }
      alert('✅ Import thành công!')
      location.reload()
    }
    input.click()
  }

  const clearData = async () => {
    if (!confirm('Xóa TẤT CẢ dữ liệu? Không thể hoàn tác!')) return
    localStorage.clear()
    alert('✅ Đã xóa dữ liệu local. Refresh trang.')
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>⚙️ Cài đặt</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* General */}
        <div className="card">
          <div className="card-header"><h2>🔧 Cài đặt chung</h2></div>
          <div className="form-group">
            <label>Tên hiển thị</label>
            <input value={settings.displayName || ''} onChange={e => setSettings({...settings, displayName: e.target.value})} placeholder="Tên của bạn" />
          </div>
          <div className="form-group">
            <label>Múi giờ</label>
            <select value={settings.timezone || 'UTC+7'} onChange={e => setSettings({...settings, timezone: e.target.value})}>
              <option value="UTC+7">UTC+7 (Việt Nam)</option>
              <option value="UTC+0">UTC+0 (London)</option>
              <option value="UTC-5">UTC-5 (New York)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Đồng tiền mặc định</label>
            <select value={settings.currency || 'USD'} onChange={e => setSettings({...settings, currency: e.target.value})}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="VND">VND</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={save}>💾 Lưu cài đặt</button>
        </div>

        {/* Trading */}
        <div className="card">
          <div className="card-header"><h2>📊 Cài đặt Trading</h2></div>
          <div className="form-group">
            <label>Risk % mặc định</label>
            <input type="number" step="0.1" value={settings.defaultRisk || 1} onChange={e => setSettings({...settings, defaultRisk: +e.target.value})} />
          </div>
          <div className="form-group">
            <label>R:R tối thiểu</label>
            <input type="number" step="0.1" value={settings.minRR || 2} onChange={e => setSettings({...settings, minRR: +e.target.value})} />
          </div>
          <div className="form-group">
            <label>Max lệnh/ngày</label>
            <input type="number" value={settings.maxTrades || 3} onChange={e => setSettings({...settings, maxTrades: +e.target.value})} />
          </div>
          <div className="form-group">
            <label>Cặp tiền ưa thích</label>
            <input value={settings.favoritePairs || 'EUR/USD, GBP/USD, USD/JPY'} onChange={e => setSettings({...settings, favoritePairs: e.target.value})} placeholder="EUR/USD, GBP/USD" />
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <div className="card-header"><h2>💾 Quản lý dữ liệu</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn btn-primary" onClick={exportData}>📤 Export Data (JSON)</button>
            <button className="btn btn-ghost" onClick={importData}>📥 Import Data (JSON)</button>
            <button className="btn btn-danger" onClick={clearData}>🗑️ Xóa tất cả dữ liệu</button>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <div className="card-header"><h2>ℹ️ Thông tin</h2></div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            <p><strong>SMC Academy</strong> v3.0</p>
            <p style={{ marginTop: 8 }}>React 19 + Express + SQLite</p>
            <p style={{ marginTop: 8 }}>Tính năng:</p>
            <ul style={{ paddingLeft: 16, marginTop: 8 }}>
              <li>Trading Journal với SMC Checklist</li>
              <li>SMC Knowledge Base + Patterns</li>
              <li>12 bài học SMC có quiz</li>
              <li>Tâm lý giao dịch</li>
              <li>Kill Zone Timer</li>
              <li>Analytics & Backtest</li>
              <li>Risk Manager</li>
              <li>Trade Calendar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
