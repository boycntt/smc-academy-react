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
import TradeCalendar from './pages/TradeCalendar'
import RiskManager from './pages/RiskManager'
import Backtest from './pages/Backtest'
import Settings from './pages/Settings'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('smc_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = () => {
    const name = prompt('Nhập tên của bạn:') || 'Trader'
    const u = { name, email: 'local@smc.app', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c6cf0&color=fff&bold=true` }
    setUser(u)
    localStorage.setItem('smc_user', JSON.stringify(u))
  }
  const logout = () => { setUser(null); localStorage.removeItem('smc_user') }

  const NI = ({ to, icon, label, end }) => (
    <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={end}>
      <span style={{ width: 22, textAlign: 'center', fontSize: 16 }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )

  const SectionLabel = ({ children }) => (
    <div style={{ padding: '16px 20px 8px', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>{children}</div>
  )

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="sidebar">
          <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📊</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5 }}><span style={{ color: 'var(--accent-light)' }}>SMC</span> Academy</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>v3.0 React</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--border)', marginBottom: 12, margin: '0 12px 12px' }}>
            {user ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                  <img src={user.avatar} alt="" style={{ width: 34, height: 34, borderRadius: 10 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                </div>
                <button onClick={logout} className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>🚪 Đăng xuất</button>
              </div>
            ) : (
              <button onClick={login} style={{ width: '100%', padding: '10px 16px', background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>🔐 Đăng nhập</button>
            )}
          </div>

          {/* ═══ TRADING ═══ */}
          <SectionLabel>Trading</SectionLabel>
          <NI to="/" icon="📈" label="Tổng quan" end />
          <NI to="/journal" icon="📓" label="Nhật ký giao dịch" />
          <NI to="/watchlist" icon="👁️" label="Watchlist" />
          <NI to="/calendar" icon="📅" label="Trade Calendar" />

          {/* ═══ PHÂN TÍCH ═══ */}
          <SectionLabel>Phân tích</SectionLabel>
          <NI to="/killzone" icon="⏰" label="Kill Zone Timer" />
          <NI to="/analytics" icon="📊" label="Analytics" />
          <NI to="/risk" icon="🛡️" label="Risk Manager" />
          <NI to="/backtest" icon="🔬" label="Backtest" />

          {/* ═══ REVIEW ═══ */}
          <SectionLabel>Đánh giá</SectionLabel>
          <NI to="/review" icon="📝" label="Daily Review" />

          {/* ═══ HỌC TẬP ═══ */}
          <SectionLabel>Học tập</SectionLabel>
          <NI to="/knowledge" icon="📚" label="SMC Knowledge" />
          <NI to="/patterns" icon="🎯" label="Patterns" />
          <NI to="/learn" icon="🎓" label="Khóa học SMC" />
          <NI to="/psychology" icon="🧠" label="Tâm lý GD" />

          {/* ═══ CÔNG CỤ ═══ */}
          <SectionLabel>Công cụ</SectionLabel>
          <NI to="/calculator" icon="🧮" label="Calculator" />
          <NI to="/settings" icon="⚙️" label="Cài đặt" />
        </nav>

        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/calendar" element={<TradeCalendar />} />
            <Route path="/killzone" element={<KillZone />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/risk" element={<RiskManager />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/review" element={<DailyReview />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/patterns" element={<Patterns />} />
            <Route path="/learn" element={<SMCLearn />} />
            <Route path="/psychology" element={<Psychology />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
