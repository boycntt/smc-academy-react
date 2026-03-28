import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import Knowledge from './pages/Knowledge'
import Patterns from './pages/Patterns'
import Watchlist from './pages/Watchlist'
import Calculator from './pages/Calculator'
import SMCLearn from './pages/SMCLearn'
import Psychology from './pages/Psychology'
import KillZone from './pages/KillZone'
import Analytics from './pages/Analytics'
import DailyReview from './pages/DailyReview'

const API = ''

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('smc_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = () => {
    const name = prompt('Nhập tên của bạn:') || 'Trader'
    const u = { name, email: 'local@smc.app', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6c5ce7&color=fff` }
    setUser(u)
    localStorage.setItem('smc_user', JSON.stringify(u))
    fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u) })
  }

  const logout = () => { setUser(null); localStorage.removeItem('smc_user') }

  const navItem = (to, icon, label) => (
    <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={to === '/'}>
      <span style={{ width: 24, textAlign: 'center' }}>{icon}</span> {label}
    </NavLink>
  )

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="sidebar">
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
            <h1 style={{ fontSize: 20 }}>📊 <span style={{ color: 'var(--accent-light)' }}>SMC</span>Academy</h1>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>React + Node.js v3.0</div>
          </div>

          {/* Login */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
            {user ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={user.avatar} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--accent)' }} alt="" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{user.email}</div>
                  </div>
                </div>
                <button onClick={logout} className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: 10 }}>🚪 Đăng xuất</button>
              </div>
            ) : (
              <button onClick={login} style={{ width: '100%', padding: 10, background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                🔐 Đăng nhập
              </button>
            )}
          </div>

          {/* Nav - Trading */}
          <div style={{ padding: '0 0 8px', fontSize: 11, color: 'var(--text-dim)', paddingLeft: 20, textTransform: 'uppercase', letterSpacing: 1 }}>Trading</div>
          {navItem('/', '📈', 'Tổng quan')}
          {navItem('/journal', '📓', 'Nhật ký')}
          {navItem('/watchlist', '👁️', 'Watchlist')}
          {navItem('/killzone', '⏰', 'Kill Zone')}
          {navItem('/analytics', '📊', 'Analytics')}
          {navItem('/review', '📝', 'Daily Review')}

          {/* Nav - Learning */}
          <div style={{ padding: '12px 0 8px', fontSize: 11, color: 'var(--text-dim)', paddingLeft: 20, textTransform: 'uppercase', letterSpacing: 1 }}>Học tập</div>
          {navItem('/knowledge', '📚', 'SMC Knowledge')}
          {navItem('/patterns', '🎯', 'Patterns')}
          {navItem('/learn', '🎓', 'Học SMC')}
          {navItem('/psychology', '🧠', 'Tâm lý GD')}

          {/* Nav - Tools */}
          <div style={{ padding: '12px 0 8px', fontSize: 11, color: 'var(--text-dim)', paddingLeft: 20, textTransform: 'uppercase', letterSpacing: 1 }}>Công cụ</div>
          {navItem('/calculator', '🧮', 'Calculator')}
        </nav>

        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/learn" element={<SMCLearn />} />
            <Route path="/psychology" element={<Psychology />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/killzone" element={<KillZone />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/review" element={<DailyReview />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
