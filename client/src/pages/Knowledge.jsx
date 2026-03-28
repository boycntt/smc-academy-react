import React, { useState } from 'react'

const concepts = [
  { id: 'bos', title: '📊 BOS — Break of Structure', keywords: 'bos break structure', img: '/smc-img/07-bos-break-of-structure.png',
    content: '<strong>Định nghĩa:</strong> BOS xảy ra khi giá PHÁ đỉnh trước (uptrend) hoặc đáy trước (downtrend) → xác nhận trend tiếp tục.<br><br><strong>Nhận diện:</strong><ul><li>Nến CLOSE phá (không chỉ wick)</li><li>Body ≥ 50% total range</li><li>Có displacement</li></ul><br><span style="color:var(--green)"><strong>✅ Dùng để:</strong> Xác nhận trend tiếp tục</span>' },
  { id: 'choch', title: '🔄 CHoCH — Change of Character', keywords: 'choch change character', img: '/smc-img/08-choch-change-of-character.png',
    content: '<strong>Định nghĩa:</strong> Phá cấu trúc NGƯỢC chiều trend → dấu hiệu đảo chiều.<br><br>Xảy ra SAU BOS. CHoCH > BOS về mức độ quan trọng.' },
  { id: 'ob', title: '📦 Order Block (OB)', keywords: 'order block ob', img: '/smc-img/10-order-block.png',
    content: '<strong>Định nghĩa:</strong> Nến cuối NGƯỢC MÀU trước impulse mạnh.<br><br><strong>3 Loại:</strong> Reversal OB ★★★★★ > Continuation OB ★★★★☆ > Breaker Block ★★★☆☆<br><br><strong>Rule:</strong> OB phải có Institutional candle. OB trong OTE zone = mạnh nhất.' },
  { id: 'fvg', title: '📐 FVG — Fair Value Gap', keywords: 'fvg fair value gap', img: '/smc-img/09-fair-value-gap.png',
    content: '<strong>Định nghĩa:</strong> Khoảng trống giữa nến 1 và nến 3. Giá bị "hút" về lấp FVG.<br><br>FVG + OB overlap = setup mạnh nhất.' },
  { id: 'liq', title: '💧 Liquidity — Thanh khoản', keywords: 'liquidity ssl bsl', img: '/smc-img/13-liquidity-sweep.png',
    content: '<strong>5 Loại:</strong> Equal Highs (BSL), Equal Lows (SSL), Trendline Liquidity, Double Top/Bottom, Session Liquidity.<br><br><span style="color:var(--red)"><strong>⚠️ BẮT BUỘC:</strong> Phải có sweep TRƯỚC khi entry</span>' },
  { id: 'idm', title: '🪤 Inducement (IDM)', keywords: 'inducement idm', img: '/smc-img/23-inducement-2.png',
    content: '<strong>Định nghĩa:</strong> Swing nhỏ tạo ra để DỤ trader. Setup có IDM = MẠNH hơn.' },
  { id: 'premium', title: '💰 Premium/Discount & OTE', keywords: 'premium discount ote', img: '/smc-img/11-premium-discount.png',
    content: '<strong>Quy tắc:</strong> BUY trong Discount (<50%), SELL trong Premium (>50%). OTE = vùng 62-79% Fib. OB ở Equilibrium = KHÔNG trade.' },
  { id: 'breaker', title: '🔨 Breaker Block', keywords: 'breaker block', img: '/smc-img/30-ict-breaker-block.png',
    content: '<strong>Định nghĩa:</strong> OB cũ bị PHÁ. Giá quay lại test = entry. Yếu hơn OB thường.' },
]

export default function Knowledge() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})

  const filtered = concepts.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.keywords.includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>📚 SMC Knowledge Base</h2>
      <input type="text" placeholder="🔍 Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', marginBottom: 20, fontSize: 14 }} />

      {filtered.map(c => (
        <div key={c.id} className="card">
          <div className="card-header" onClick={() => setExpanded({ ...expanded, [c.id]: !expanded[c.id] })}>
            <h2>{c.title}</h2>
            <span>{expanded[c.id] ? '▼' : '▶'}</span>
          </div>
          {expanded[c.id] && (
            <div>
              {c.img && <img src={c.img} alt={c.title} style={{ width: '100%', maxWidth: 600, borderRadius: 8, margin: '12px 0', border: '1px solid var(--border)' }} />}
              <div dangerouslySetInnerHTML={{ __html: c.content }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
