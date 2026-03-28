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
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { const s = localStorage.getItem('smc_user'); if (s) setUser(JSON.parse(s)) }, [])

  const login = () => {
    const n = prompt('Nhập tên:') || 'Trader'
    const u = { name: n, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=6a4ce0&color=fff&bold=true` }
    setUser(u); localStorage.setItem('smc_user', JSON.stringify(u))
  }
  const logout = () => { setUser(null); localStorage.removeItem('smc_user') }
  const closeMenu = () => setMenuOpen(false)

  const N = ({ to, i, l }) => <NavLink to={to} end={to==='/'} className={({isActive}) => `nav-item ${isActive?'active':''}`} onClick={closeMenu}><span style={{width:20,textAlign:'center',fontSize:14}}>{i}</span>{l}</NavLink>
  const S = ({t}) => <div style={{padding:'12px 16px 4px',fontSize:9,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1.5,fontWeight:700}}>{t}</div>

  const Sidebar = () => (
    <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div style={{padding:'0 16px 14px',borderBottom:'1px solid var(--border)',marginBottom:8}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,var(--accent),var(--accent-light))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>📊</div>
            <div><div style={{fontSize:14,fontWeight:700}}><span style={{color:'var(--accent-light)'}}>SMC</span> Academy</div><div style={{fontSize:8,color:'var(--text-muted)'}}>v3.0</div></div>
          </div>
          <button onClick={closeMenu} style={{display:'none',background:'none',border:'none',color:'var(--text)',fontSize:20,cursor:'pointer'}} className="mobile-close-btn">✕</button>
        </div>
      </div>

      <div style={{padding:'0 12px 10px',borderBottom:'1px solid var(--border)',marginBottom:6}}>
        {user ? (
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <img src={user.avatar} alt="" style={{width:26,height:26,borderRadius:6}}/>
            <div style={{flex:1,minWidth:0,fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
            <button onClick={logout} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,opacity:0.5}}>🚪</button>
          </div>
        ) : <button onClick={login} style={{width:'100%',padding:'7px',background:'linear-gradient(135deg,var(--accent),var(--accent-light))',color:'white',border:'none',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:600}}>🔐 Đăng nhập</button>}
      </div>

      <div style={{flex:1,overflowY:'auto',paddingBottom:8}}>
        <S t="Trading"/>
        <N to="/" i="📈" l="Tổng quan"/>
        <N to="/journal" i="📓" l="Nhật ký"/>
        <N to="/watchlist" i="👁️" l="Watchlist"/>
        <N to="/calendar" i="📅" l="Calendar"/>
        <S t="Phân tích"/>
        <N to="/killzone" i="⏰" l="Kill Zone"/>
        <N to="/analytics" i="📊" l="Analytics"/>
        <N to="/risk" i="🛡️" l="Risk Manager"/>
        <N to="/backtest" i="🔬" l="Backtest"/>
        <S t="Đánh giá"/>
        <N to="/review" i="📝" l="Daily Review"/>
        <S t="Học tập"/>
        <N to="/knowledge" i="📚" l="Knowledge"/>
        <N to="/patterns" i="🎯" l="Patterns"/>
        <N to="/learn" i="🎓" l="Khóa học"/>
        <N to="/psychology" i="🧠" l="Tâm lý GD"/>
        <S t="Công cụ"/>
        <N to="/calculator" i="🧮" l="Calculator"/>
        <N to="/settings" i="⚙️" l="Cài đặt"/>
      </div>
    </nav>
  )

  return (
    <BrowserRouter>
    <div className="app">
      <div className={`sidebar-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu}/>
      <Sidebar/>

      {/* Mobile Header */}
      <div className="mobile-header" style={{display:'none'}}>
        <button onClick={() => setMenuOpen(true)} style={{background:'none',border:'none',color:'var(--text)',fontSize:24,cursor:'pointer',padding:4}}>☰</button>
        <div style={{fontSize:15,fontWeight:700}}><span style={{color:'var(--accent-light)'}}>SMC</span> Academy</div>
        <div style={{flex:1}}/>
        {user && <img src={user.avatar} alt="" style={{width:28,height:28,borderRadius:6}}/>}
      </div>

      <div className="main">
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/journal" element={<Journal/>}/>
          <Route path="/knowledge" element={<Knowledge/>}/>
          <Route path="/patterns" element={<Patterns/>}/>
          <Route path="/learn" element={<SMCLearn/>}/>
          <Route path="/psychology" element={<Psychology/>}/>
          <Route path="/watchlist" element={<Watchlist/>}/>
          <Route path="/calculator" element={<Calculator/>}/>
          <Route path="/killzone" element={<KillZone/>}/>
          <Route path="/analytics" element={<Analytics/>}/>
          <Route path="/review" element={<DailyReview/>}/>
          <Route path="/calendar" element={<TradeCalendar/>}/>
          <Route path="/risk" element={<RiskManager/>}/>
          <Route path="/backtest" element={<Backtest/>}/>
          <Route path="/settings" element={<Settings/>}/>
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  )
}
export default App
