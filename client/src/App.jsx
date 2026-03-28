import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import Knowledge from './pages/Knowledge'
import Watchlist from './pages/Watchlist'
import Calculator from './pages/Calculator'
import SMCLearn from './pages/SMCLearn'
import Psychology from './pages/Psychology'

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
                  <img src={user.avatar} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--accent)' }} />
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

          {/* Nav */}
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <span style={{ width: 24, textAlign: 'center' }}>📈</span> Tổng quan
          </NavLink>
          <NavLink to="/journal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ width: 24, textAlign: 'center' }}>📓</span> Nhật ký
          </NavLink>
          <NavLink to="/knowledge" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ width: 24, textAlign: 'center' }}>📚</span> SMC Knowledge
          </NavLink>
          <NavLink to="/learn" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ width: 24, textAlign: 'center' }}>🎓</span> Học SMC
          </NavLink>
          <NavLink to="/psychology" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ width: 24, textAlign: 'center' }}>🧠</span> Tâm lý GD
          </NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ width: 24, textAlign: 'center' }}>👁️</span> Watchlist
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span style={{ width: 24, textAlign: 'center' }}>🧮</span> Calculator
          </NavLink>
        </nav>

        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/learn" element={<SMCLearn />} />
            <Route path="/psychology" element={<Psychology />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
