import React, { useState } from 'react'

const patterns = [
  {
    id: 'bos-up',
    name: 'BOS UP — Phá đỉnh (Trend tiếp tục UP)',
    category: 'Structure',
    color: 'var(--green)',
    desc: 'Giá phá đỉnh trước với body nến rõ ràng → Xác nhận uptrend tiếp tục.',
    identify: [
      'Nến CLOSE PHÁ đỉnh cũ (không chỉ wick)',
      'Body nến ≥ 50% total range',
      'Có displacement (nến lớn hơn nến trước)',
      'Phá đỉnh đã tạo ít nhất 2 nến trước',
    ],
    entry: 'Sau BOS → chờ pullback về OB → Entry khi có BOS nhỏ confirm',
    avoid: ['Spike wick ≠ BOS', 'Nến doji/spinning top', 'Không có displacement'],
    rr: '1:2 minimum',
    tf: 'H4/D1 (confirm trend), M15/M5 (entry trigger)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <path d="M10,100 L40,70 L50,85 L80,50 L90,65 L120,30 L130,45 L170,10" stroke="#00b894" stroke-width="2.5" fill="none"/>
      <line x1="80" y1="50" x2="200" y2="50" stroke="#e17055" stroke-width="1" stroke-dasharray="4"/>
      <line x1="120" y1="30" x2="200" y2="30" stroke="#00b894" stroke-width="1" stroke-dasharray="4"/>
      <text x="82" y="48" font-size="10" fill="#e17055">HH cũ</text>
      <text x="122" y="28" font-size="10" fill="#00b894">HH mới (BOS)</text>
      <text x="140" y="60" font-size="11" fill="#00b894" font-weight="bold">BOS ✅</text>
    </svg>`
  },
  {
    id: 'bos-down',
    name: 'BOS DOWN — Phá đáy (Trend tiếp tục DOWN)',
    category: 'Structure',
    color: 'var(--red)',
    desc: 'Giá phá đáy trước với body nến rõ ràng → Xác nhận downtrend tiếp tục.',
    identify: [
      'Nến CLOSE PHÁ đáy cũ (không chỉ wick)',
      'Body nến ≥ 50% total range',
      'Có displacement (nến lớn hơn nến trước)',
    ],
    entry: 'Sau BOS → chờ pullback về OB → Entry khi có BOS nhỏ confirm',
    avoid: ['Spike wick ≠ BOS', 'Không có volume confirm'],
    rr: '1:2 minimum',
    tf: 'H4/D1 (confirm), M15/M5 (entry)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <path d="M10,20 L40,50 L50,35 L80,70 L90,55 L120,90 L130,75 L170,110" stroke="#e17055" stroke-width="2.5" fill="none"/>
      <line x1="80" y1="70" x2="200" y2="70" stroke="#00b894" stroke-width="1" stroke-dasharray="4"/>
      <line x1="120" y1="90" x2="200" y2="90" stroke="#e17055" stroke-width="1" stroke-dasharray="4"/>
      <text x="82" y="68" font-size="10" fill="#00b894">LL cũ</text>
      <text x="122" y="88" font-size="10" fill="#e17055">LL mới (BOS)</text>
      <text x="140" y="50" font-size="11" fill="#e17055" font-weight="bold">BOS ✅</text>
    </svg>`
  },
  {
    id: 'choch-bearish',
    name: 'CHoCH Bearish — Đảo chiều Uptrend → Downtrend',
    category: 'Structure',
    color: 'var(--orange)',
    desc: 'Uptrend tạo Lower High → phá Higher Low → Đảo chiều xuống.',
    identify: [
      'Xảy ra SAU BOS của uptrend',
      'Giá tạo LH (Lower High) đầu tiên',
      'Phá vỡ HL (Higher Low) trước đó',
      'Có institutional candle confirm',
    ],
    entry: 'Sau CHoCH → chờ pullback về OB cũ (bearish) → SELL',
    avoid: ['CHoCH trong sideway = yếu', 'Không có BOS trước CHoCH'],
    rr: '1:2 minimum',
    tf: 'H4/H1 (signal), M15 (confirm)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <path d="M10,90 L40,40 L55,60 L80,25 L95,50 L110,35 L125,55 L140,45 L160,70 L180,100" stroke="#fdcb6e" stroke-width="2.5" fill="none"/>
      <text x="42" y="38" font-size="9" fill="#00b894">HH</text>
      <text x="57" y="58" font-size="9" fill="#00b894">HL</text>
      <text x="82" y="23" font-size="9" fill="#00b894">HH</text>
      <text x="112" y="33" font-size="9" fill="#fdcb6e">LH ←</text>
      <text x="142" y="43" font-size="9" fill="#fdcb6e">CHoCH</text>
      <text x="162" y="68" font-size="9" fill="#e17055">LL</text>
      <rect x="108" y="20" width="75" height="90" fill="none" stroke="#fdcb6e" stroke-width="1" stroke-dasharray="3" rx="4"/>
    </svg>`
  },
  {
    id: 'choch-bullish',
    name: 'CHoCH Bullish — Đảo chiều Downtrend → Uptrend',
    category: 'Structure',
    color: 'var(--green)',
    desc: 'Downtrend tạo Higher Low → phá Lower High → Đảo chiều lên.',
    identify: [
      'Xảy ra SAU BOS của downtrend',
      'Giá tạo HL (Higher Low) đầu tiên',
      'Phá vỡ LH (Lower High) trước đó',
      'Có institutional candle confirm',
    ],
    entry: 'Sau CHoCH → chờ pullback về OB mới (bullish) → BUY',
    avoid: ['CHoCH yếu nếu không có volume'],
    rr: '1:2 minimum',
    tf: 'H4/H1 (signal), M15 (confirm)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <path d="M10,30 L40,80 L55,60 L80,95 L95,70 L110,85 L125,60 L140,70 L160,45 L180,20" stroke="#00b894" stroke-width="2.5" fill="none"/>
      <text x="42" y="78" font-size="9" fill="#e17055">LL</text>
      <text x="57" y="58" font-size="9" fill="#e17055">LH</text>
      <text x="82" y="93" font-size="9" fill="#e17055">LL</text>
      <text x="112" y="83" font-size="9" fill="#00b894">HL ←</text>
      <text x="135" y="68" font-size="9" fill="#00b894">CHoCH</text>
      <text x="162" y="43" font-size="9" fill="#00b894">HH</text>
    </svg>`
  },
  {
    id: 'bullish-ob',
    name: 'Bullish Order Block — Vùng MUA',
    category: 'Order Block',
    color: 'var(--green)',
    desc: 'Nến giảm cuối cùng TRƯỚC impulse tăng mạnh. Nơi smart money đặt lệnh BUY.',
    identify: [
      'Nến trước impulse PHẢI là nến giảm (bearish)',
      'Impulse sau OB body ≥ 2x body OB',
      'Impulse tạo BOS (phá đỉnh)',
      'OB nằm trong Discount zone (< 50% Fib)',
      'Có FVG trong/near OB = mạnh nhất',
    ],
    entry: 'Giá pullback về OB → có sweep SSL → BOS nhỏ → BUY',
    avoid: ['OB đã mitigated 2+ lần', 'OB ở Equilibrium', 'Không có institutional candle'],
    rr: '1:2 → 1:5',
    tf: 'H1 (OB), M15 (confirm), M5 (entry)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <rect x="70" y="70" width="30" height="20" fill="rgba(0,184,148,0.3)" stroke="#00b894" stroke-width="1.5"/>
      <path d="M10,60 L30,65 L50,55 L70,75 L100,30 L130,35 L160,20 L190,25" stroke="#e4e6f0" stroke-width="2" fill="none"/>
      <path d="M70,75 L70,85 L100,85 L100,75" stroke="#e17055" stroke-width="2" fill="none"/>
      <path d="M100,75 L100,25" stroke="#00b894" stroke-width="2.5" fill="none"/>
      <text x="72" y="100" font-size="9" fill="#00b894" font-weight="bold">Bullish OB</text>
      <text x="105" y="22" font-size="9" fill="#00b894">Impulse ↑</text>
      <path d="M150,60 L170,50" stroke="#00b894" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="155" y="70" font-size="8" fill="#8b8fa3">Entry zone</text>
    </svg>`
  },
  {
    id: 'bearish-ob',
    name: 'Bearish Order Block — Vùng BÁN',
    category: 'Order Block',
    color: 'var(--red)',
    desc: 'Nến tăng cuối cùng TRƯỚC impulse giảm mạnh. Nơi smart money đặt lệnh SELL.',
    identify: [
      'Nến trước impulse PHẢI là nến tăng (bullish)',
      'Impulse sau OB body ≥ 2x body OB',
      'Impulse tạo BOS (phá đáy)',
      'OB nằm trong Premium zone (> 50% Fib)',
      'Có FVG trong/near OB = mạnh nhất',
    ],
    entry: 'Giá pullback về OB → có sweep BSL → BOS nhỏ → SELL',
    avoid: ['OB đã mitigated', 'OB ngược trend D1'],
    rr: '1:2 → 1:5',
    tf: 'H1 (OB), M15 (confirm), M5 (entry)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <rect x="70" y="30" width="30" height="20" fill="rgba(225,112,85,0.3)" stroke="#e17055" stroke-width="1.5"/>
      <path d="M10,60 L30,55 L50,65 L70,45 L100,90 L130,85 L160,100 L190,95" stroke="#e4e6f0" stroke-width="2" fill="none"/>
      <path d="M70,45 L70,35 L100,35 L100,45" stroke="#00b894" stroke-width="2" fill="none"/>
      <path d="M100,45 L100,95" stroke="#e17055" stroke-width="2.5" fill="none"/>
      <text x="72" y="25" font-size="9" fill="#e17055" font-weight="bold">Bearish OB</text>
      <text x="105" y="100" font-size="9" fill="#e17055">Impulse ↓</text>
    </svg>`
  },
  {
    id: 'bullish-fvg',
    name: 'Bullish FVG — Khoảng trống tăng',
    category: 'Imbalance',
    color: 'var(--blue)',
    desc: 'Giá tăng quá nhanh, bỏ qua vùng giữa. Giá bị "hút" về lấp gap.',
    identify: [
      'Low nến 3 > High nến 1 (không overlap)',
      'Nến 2 tạo move mạnh (momentum)',
      'Gap rõ ràng (≥ body nến trung bình)',
      'Xuất hiện SAU institutional candle',
    ],
    entry: 'Giá pullback về FVG → có rejection → BUY',
    avoid: ['FVG quá nhỏ (<5 pips)', 'FVG trong sideway'],
    rr: '1:2',
    tf: 'H1+ (ít noise hơn M5)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <rect x="70" y="30" width="60" height="30" fill="rgba(116,185,255,0.15)" stroke="#74b9ff" stroke-width="1" stroke-dasharray="4"/>
      <rect x="40" y="70" width="20" height="25" fill="#e17055" opacity="0.5"/>
      <rect x="60" y="25" width="20" height="50" fill="#74b9ff" opacity="0.5"/>
      <rect x="100" y="55" width="20" height="25" fill="#00b894" opacity="0.5"/>
      <text x="75" y="25" font-size="9" fill="#74b9ff" font-weight="bold">FVG</text>
      <text x="42" y="108" font-size="8" fill="#8b8fa3">Nến 1</text>
      <text x="62" y="108" font-size="8" fill="#8b8fa3">Nến 2</text>
      <text x="102" y="108" font-size="8" fill="#8b8fa3">Nến 3</text>
      <path d="M90,60 L90,45" stroke="#74b9ff" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="92" y="55" font-size="7" fill="#74b9ff">← Price fill</text>
    </svg>`
  },
  {
    id: 'bearish-fvg',
    name: 'Bearish FVG — Khoảng trống giảm',
    category: 'Imbalance',
    color: 'var(--blue)',
    desc: 'Giá giảm quá nhanh, bỏ qua vùng giữa. Giá bị "hút" về lấp gap.',
    identify: [
      'High nến 3 < Low nến 1 (không overlap)',
      'Nến 2 tạo move mạnh đi xuống',
      'Gap rõ ràng',
    ],
    entry: 'Giá pullback về FVG → có rejection → SELL',
    avoid: ['FVG quá nhỏ', 'Đã bị lấp hoàn toàn'],
    rr: '1:2',
    tf: 'H1+',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <rect x="70" y="60" width="60" height="30" fill="rgba(116,185,255,0.15)" stroke="#74b9ff" stroke-width="1" stroke-dasharray="4"/>
      <rect x="40" y="25" width="20" height="25" fill="#00b894" opacity="0.5"/>
      <rect x="60" y="40" width="20" height="55" fill="#74b9ff" opacity="0.5"/>
      <rect x="100" y="65" width="20" height="25" fill="#e17055" opacity="0.5"/>
      <text x="75" y="55" font-size="9" fill="#74b9ff" font-weight="bold">FVG</text>
      <path d="M90,55 L90,75" stroke="#74b9ff" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="92" y="70" font-size="7" fill="#74b9ff">← Price fill</text>
    </svg>`
  },
  {
    id: 'liquidity-sweep',
    name: 'Liquidity Sweep — Quét thanh khoản',
    category: 'Liquidity',
    color: 'var(--orange)',
    desc: 'Giá phá đỉnh/đáy (lấy SL) rồi đảo chiều. ĐÂY LÀ CONFIRMATION BẮT BUỘC.',
    identify: [
      'Wick dài phá Equal Highs/Lows',
      'Close lại TRONG range (không close phá)',
      'Nến rejection (pin bar) sau sweep',
      'Sau đó có BOS nhỏ cùng chiều setup',
    ],
    entry: 'SAU sweep → có rejection → BOS nhỏ → Entry',
    avoid: ['Vào TRƯỚC khi sweep', 'Sweep close phá luôn (breakout)'],
    rr: '1:2 → 1:4',
    tf: 'M15/M5 (sweep), H1 (context)',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <line x1="10" y1="50" x2="190" y2="50" stroke="#fdcb6e" stroke-width="1" stroke-dasharray="4"/>
      <text x="5" y="48" font-size="8" fill="#fdcb6e">SSL</text>
      <path d="M40,30 L60,35 L80,30 L100,35 L120,75 L125,45 L150,30 L180,25" stroke="#e4e6f0" stroke-width="2" fill="none"/>
      <line x1="120" y1="30" x2="120" y2="80" stroke="#e17055" stroke-width="2"/>
      <circle cx="120" cy="80" r="4" fill="#e17055"/>
      <text x="125" y="85" font-size="9" fill="#e17055" font-weight="bold">SWEEP</text>
      <path d="M120,45 L150,20" stroke="#00b894" stroke-width="2.5"/>
      <text x="155" y="25" font-size="9" fill="#00b894">↑ REJECT</text>
    </svg>`
  },
  {
    id: 'inducement',
    name: 'Inducement (IDM) — Bẫy dụ trader',
    category: 'Liquidity',
    color: 'var(--accent-light)',
    desc: 'Swing nhỏ tạo ra để dụ trader vào lệnh SAI. Có IDM = setup MẠNH hơn.',
    identify: [
      'Swing nhỏ trước khi giá đi đúng hướng',
      'Dụ trader vào lệnh ngược chiều',
      'Sau đó quét SL của họ',
      'Rồi mới đi đúng hướng thật',
    ],
    entry: 'Nhận diện IDM → chờ sweep → BOS → Entry',
    avoid: ['Không có IDM = setup kém hơn', 'Nhầm IDM với BOS thật'],
    rr: '1:2+',
    tf: 'H1/M15',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <path d="M10,80 L40,70 L60,40 L75,55 L90,35 L100,50 L110,85 L120,55 L160,20 L190,15" stroke="#e4e6f0" stroke-width="2" fill="none"/>
      <rect x="55" y="25" width="50" height="35" fill="none" stroke="#a29bfe" stroke-width="1.5" stroke-dasharray="4" rx="4"/>
      <text x="60" y="22" font-size="9" fill="#a29bfe" font-weight="bold">IDM (bẫy)</text>
      <text x="115" y="82" font-size="9" fill="#e17055">← Sweep SL</text>
      <text x="140" y="18" font-size="9" fill="#00b894">↑ Tăng thật</text>
      <path d="M110,85 L115,80" stroke="#e17055" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 'breaker-block',
    name: 'Breaker Block — OB bị phá',
    category: 'Order Block',
    color: 'var(--orange)',
    desc: 'OB cũ bị PHÁ VỠ. Khi giá quay lại test = entry. Yếu hơn OB thường.',
    identify: [
      'OB ban đầu bị giá phá qua',
      'Role đổi: support → resistance (hoặc ngược lại)',
      'Giá quay lại test breaker block',
      'Có rejection tại breaker block',
    ],
    entry: 'Giá test breaker block → rejection → Entry',
    avoid: ['Yếu hơn OB thường', 'Chỉ trade khi có confirmation'],
    rr: '1:2',
    tf: 'H1/M15',
    svg: `<svg viewBox="0 0 200 120" style="width:100%;max-width:300px">
      <rect x="60" y="50" width="35" height="15" fill="rgba(0,184,148,0.3)" stroke="#00b894" stroke-width="1.5"/>
      <path d="M10,60 L40,55 L60,65 L95,35 L130,40 L160,30 L190,35" stroke="#e4e6f0" stroke-width="2" fill="none"/>
      <path d="M95,65 L95,35" stroke="#00b894" stroke-width="2" fill="none"/>
      <path d="M95,35 L130,55 L140,50 L160,70 L180,95" stroke="#e4e6f0" stroke-width="2" fill="none"/>
      <text x="62" y="48" font-size="8" fill="#00b894">OB (bị phá)</text>
      <text x="135" y="53" font-size="9" fill="#fdcb6e" font-weight="bold">Breaker</text>
      <text x="135" y="63" font-size="8" fill="#fdcb6e">← Test</text>
    </svg>`
  },
  {
    id: 'full-setup-buy',
    name: '🎯 FULL BUY SETUP — Tất cả kết hợp',
    category: 'Setup',
    color: 'var(--green)',
    desc: 'Setup BUY hoàn chỉnh: Trend UP + OB + FVG + Sweep + BOS = 4/4 confirm.',
    identify: [
      'B1: D1/H4 Uptrend (HH+HL) ✅',
      'B2: Pullback về Bullish OB trong Discount ✅',
      'B3: OB có FVG overlap ✅',
      'B4: Quét SSL (equal lows) ✅',
      'B5: Institutional candle + BOS nhỏ ✅',
      'B6: Entry trong Kill Zone ✅',
      'B7: SL dưới sweep, TP tại BSL, R:R ≥ 1:2 ✅',
    ],
    entry: '4/4 confirm → Conservative: retest BOS → BUY',
    avoid: ['Thiếu confirm = KHÔNG VÀO', 'Ngoài Kill Zone = KHÔNG VÀO'],
    rr: '1:2 → 1:5',
    tf: 'D1/H4 (trend) → H1 (OB) → M15 (confirm) → M5 (entry)',
    svg: `<svg viewBox="0 0 300 140" style="width:100%;max-width:400px">
      <text x="5" y="12" font-size="10" fill="#00b894" font-weight="bold">BUY SETUP — 4/4 Confirm</text>
      <path d="M20,100 L50,80 L70,90 L100,50 L120,60 L150,30 L180,40 L220,20 L260,15" stroke="#e4e6f0" stroke-width="2" fill="none"/>
      <rect x="95" y="75" width="30" height="15" fill="rgba(0,184,148,0.4)" stroke="#00b894" stroke-width="1.5"/>
      <text x="97" y="85" font-size="7" fill="#00b894">OB</text>
      <rect x="95" y="60" width="30" height="10" fill="rgba(116,185,255,0.3)" stroke="#74b9ff" stroke-width="1" stroke-dasharray="3"/>
      <text x="97" y="68" font-size="6" fill="#74b9ff">FVG</text>
      <line x1="10" y1="95" x2="200" y2="95" stroke="#fdcb6e" stroke-width="1" stroke-dasharray="3"/>
      <text x="5" y="93" font-size="7" fill="#fdcb6e">SSL</text>
      <circle cx="120" cy="100" r="3" fill="#e17055"/>
      <text x="125" y="103" font-size="7" fill="#e17055">Sweep</text>
      <path d="M120,70 L150,25" stroke="#00b894" stroke-width="2.5"/>
      <text x="130" y="20" font-size="8" fill="#00b894">↑ BOS → Entry</text>
      <line x1="220" y1="12" x2="220" y2="130" stroke="#00b894" stroke-width="1" stroke-dasharray="2"/>
      <text x="225" y="15" font-size="8" fill="#00b894">BSL (TP)</text>
      <line x1="120" y1="105" x2="120" y2="130" stroke="#e17055" stroke-width="1"/>
      <text x="105" y="138" font-size="8" fill="#e17055">SL</text>
    </svg>`
  },
]

const categories = ['All', 'Structure', 'Order Block', 'Imbalance', 'Liquidity', 'Setup']

export default function Patterns() {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState({})

  const filtered = filter === 'All' ? patterns : patterns.filter(p => p.category === filter)

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>🎯 SMC Patterns — Nhận diện & Entry</h2>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} className={`btn ${filter === c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {filtered.map(p => (
        <div key={p.id} className="card">
          <div className="card-header" onClick={() => setExpanded({ ...expanded, [p.id]: !expanded[p.id] })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, background: p.color }} />
              <h2>{p.name}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-deposit" style={{ fontSize: 11 }}>{p.category}</span>
              <span>{expanded[p.id] ? '▼' : '▶'}</span>
            </div>
          </div>

          {expanded[p.id] && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Left: Info */}
              <div>
                <p style={{ marginBottom: 12, fontSize: 14 }}>{p.desc}</p>

                <h3 style={{ color: 'var(--accent-light)', fontSize: 14, marginBottom: 8 }}>🔍 Nhận diện</h3>
                <ul style={{ paddingLeft: 16, marginBottom: 12, fontSize: 13 }}>
                  {p.identify.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
                </ul>

                <h3 style={{ color: 'var(--green)', fontSize: 14, marginBottom: 8 }}>🎯 Entry</h3>
                <p style={{ fontSize: 13, marginBottom: 12 }}>{p.entry}</p>

                <h3 style={{ color: 'var(--red)', fontSize: 14, marginBottom: 8 }}>❌ Tránh</h3>
                <ul style={{ paddingLeft: 16, marginBottom: 12, fontSize: 13 }}>
                  {p.avoid.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
                </ul>

                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <div><strong>R:R:</strong> <span style={{ color: 'var(--green)' }}>{p.rr}</span></div>
                  <div><strong>TF:</strong> <span style={{ color: 'var(--blue)' }}>{p.tf}</span></div>
                </div>
              </div>

              {/* Right: SVG Diagram */}
              <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
                <div dangerouslySetInnerHTML={{ __html: p.svg }} />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Summary */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--card), rgba(108,92,231,0.1))' }}>
        <div className="card-header"><h2>⚡ Tóm tắt — Checklist trước mỗi lệnh</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
          <label>□ Trend D1/H4 rõ ràng?</label>
          <label>□ OB trong Discount/Premium?</label>
          <label>□ OB có FVG?</label>
          <label>□ Có IDM?</label>
          <label>□ Đã quét liquidity?</label>
          <label>□ Institutional candle?</label>
          <label>□ BOS nhỏ confirm?</label>
          <label>□ Trong Kill Zone?</label>
          <label>□ R:R ≥ 1:2?</label>
          <label>□ Risk ≤ 2%?</label>
        </div>
        <p style={{ textAlign: 'center', marginTop: 12, color: 'var(--red)', fontWeight: 700 }}>
          10/10 = VÀO LỆNH ✅ | Dưới 10 = KHÔNG VÀO ❌
        </p>
      </div>
    </div>
  )
}
