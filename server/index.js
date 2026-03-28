const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve React build in production
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Database
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/var/data/smc.db' 
  : path.join(__dirname, 'smc.db');

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Init tables
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    balance REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER,
    type TEXT CHECK(type IN ('buy','sell','deposit','withdrawal')),
    pair TEXT, amount REAL, price REAL, quantity REAL,
    fee REAL DEFAULT 0, profit_loss REAL DEFAULT 0, note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS journal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL, time TEXT, pair TEXT NOT NULL,
    timeframe TEXT, direction TEXT CHECK(direction IN ('BUY','SELL')),
    entry_price REAL, sl_price REAL, tp_price REAL,
    sl_pips INTEGER, tp_pips INTEGER, rr_ratio REAL,
    lot_size REAL, risk_percent REAL,
    result TEXT DEFAULT 'RUNNING', pnl REAL DEFAULT 0,
    setup_type TEXT, session TEXT, checklist TEXT,
    notes TEXT, emotions TEXT, lessons TEXT, tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pair TEXT NOT NULL, bias TEXT DEFAULT 'NEUTRAL',
    h4_trend TEXT, notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS daily_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE, total_trades INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0, losses INTEGER DEFAULT 0,
    total_pnl REAL DEFAULT 0, win_rate REAL DEFAULT 0,
    plan_compliance REAL DEFAULT 0,
    emotions TEXT, lessons TEXT, tomorrow_plan TEXT
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE, name TEXT, avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// === API ROUTES ===

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, name, avatar } = req.body;
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    const r = db.prepare('INSERT INTO users (email, name, avatar) VALUES (?, ?, ?)').run(email, name, avatar);
    user = { id: r.lastInsertRowid, email, name, avatar };
  }
  res.json(user);
});

// Accounts
app.get('/api/accounts', (req, res) => res.json(db.prepare('SELECT * FROM accounts ORDER BY id DESC').all()));
app.post('/api/accounts', (req, res) => {
  const r = db.prepare('INSERT INTO accounts (name, currency, balance) VALUES (?,?,?)').run(req.body.name, req.body.currency||'USD', req.body.balance||0);
  res.json({ id: r.lastInsertRowid });
});
app.delete('/api/accounts/:id', (req, res) => {
  db.prepare('DELETE FROM transactions WHERE account_id=?').run(req.params.id);
  db.prepare('DELETE FROM accounts WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// Transactions
app.get('/api/transactions', (req, res) => {
  let sql = 'SELECT t.*, a.name as account_name FROM transactions t JOIN accounts a ON t.account_id=a.id WHERE 1=1';
  const p = [];
  if (req.query.type) { sql += ' AND t.type=?'; p.push(req.query.type); }
  if (req.query.pair) { sql += ' AND t.pair LIKE ?'; p.push(`%${req.query.pair}%`); }
  sql += ' ORDER BY t.created_at DESC';
  if (req.query.limit) { sql += ' LIMIT ?'; p.push(+req.query.limit); }
  res.json({ transactions: db.prepare(sql).all(...p), total: db.prepare('SELECT COUNT(*) as c FROM transactions').get().c });
});
app.post('/api/transactions', (req, res) => {
  const b = req.body;
  const r = db.prepare('INSERT INTO transactions (account_id,type,pair,amount,price,quantity,fee,profit_loss,note) VALUES (?,?,?,?,?,?,?,?,?)').run(b.account_id,b.type,b.pair,b.amount,b.price,b.quantity,b.fee||0,b.profit_loss||0,b.note);
  // Update balance
  const acc = db.prepare('SELECT * FROM accounts WHERE id=?').get(b.account_id);
  if (acc) {
    let nb = acc.balance;
    if (b.type==='deposit') nb += b.amount;
    else if (b.type==='withdrawal') nb -= b.amount;
    else if (b.type==='buy') nb -= b.amount+(b.fee||0);
    else if (b.type==='sell') nb += b.amount-(b.fee||0)+(b.profit_loss||0);
    db.prepare('UPDATE accounts SET balance=? WHERE id=?').run(nb, b.account_id);
  }
  res.json({ id: r.lastInsertRowid });
});
app.delete('/api/transactions/:id', (req, res) => { db.prepare('DELETE FROM transactions WHERE id=?').run(req.params.id); res.json({ ok: true }); });

// Stats
app.get('/api/stats', (req, res) => {
  const q = (s) => db.prepare(s).get();
  res.json({
    totalAccounts: q("SELECT COUNT(*) as c FROM accounts").c,
    totalBalance: q("SELECT COALESCE(SUM(balance),0) as s FROM accounts").s,
    totalPL: q("SELECT COALESCE(SUM(profit_loss),0) as s FROM transactions WHERE type IN ('buy','sell')").s,
    todayPL: q("SELECT COALESCE(SUM(profit_loss),0) as s FROM transactions WHERE type IN ('buy','sell') AND date(created_at)=date('now')").s,
    monthPL: q("SELECT COALESCE(SUM(profit_loss),0) as s FROM transactions WHERE type IN ('buy','sell') AND strftime('%Y-%m',created_at)=strftime('%Y-%m','now')").s,
    tradeCount: q("SELECT COUNT(*) as c FROM transactions WHERE type IN ('buy','sell')").c,
    winRate: (() => { const t=q("SELECT COUNT(*) as c FROM transactions WHERE type IN ('buy','sell')").c; const w=q("SELECT COUNT(*) as c FROM transactions WHERE type IN ('buy','sell') AND profit_loss>0").c; return t>0?((w/t)*100).toFixed(1):0; })(),
    dailyPL: db.prepare("SELECT date(created_at) as date, SUM(profit_loss) as pl FROM transactions WHERE type IN ('buy','sell') GROUP BY date(created_at) ORDER BY date DESC LIMIT 30").all().reverse()
  });
});

// Journal
app.get('/api/journal', (req, res) => {
  let sql = 'SELECT * FROM journal WHERE 1=1'; const p = [];
  if (req.query.date) { sql += ' AND date=?'; p.push(req.query.date); }
  if (req.query.result) { sql += ' AND result=?'; p.push(req.query.result); }
  if (req.query.pair) { sql += ' AND pair LIKE ?'; p.push(`%${req.query.pair}%`); }
  sql += ' ORDER BY date DESC, time DESC';
  if (req.query.limit) { sql += ' LIMIT ?'; p.push(+req.query.limit); }
  res.json(db.prepare(sql).all(...p));
});
app.post('/api/journal', (req, res) => {
  const b = req.body;
  const r = db.prepare('INSERT INTO journal (date,time,pair,timeframe,direction,entry_price,sl_price,tp_price,sl_pips,tp_pips,rr_ratio,lot_size,risk_percent,result,pnl,setup_type,session,checklist,notes,emotions,lessons,tags) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(b.date,b.time,b.pair,b.timeframe,b.direction,b.entry_price,b.sl_price,b.tp_price,b.sl_pips,b.tp_pips,b.rr_ratio,b.lot_size,b.risk_percent,b.result||'RUNNING',b.pnl||0,b.setup_type,b.session,b.checklist,b.notes,b.emotions,b.lessons,b.tags);
  res.json({ id: r.lastInsertRowid });
});
app.put('/api/journal/:id', (req, res) => {
  const b = req.body;
  db.prepare('UPDATE journal SET date=?,time=?,pair=?,timeframe=?,direction=?,entry_price=?,sl_price=?,tp_price=?,sl_pips=?,tp_pips=?,rr_ratio=?,lot_size=?,risk_percent=?,result=?,pnl=?,setup_type=?,session=?,checklist=?,notes=?,emotions=?,lessons=?,tags=? WHERE id=?').run(b.date,b.time,b.pair,b.timeframe,b.direction,b.entry_price,b.sl_price,b.tp_price,b.sl_pips,b.tp_pips,b.rr_ratio,b.lot_size,b.risk_percent,b.result,b.pnl,b.setup_type,b.session,b.checklist,b.notes,b.emotions,b.lessons,b.tags,req.params.id);
  res.json({ ok: true });
});
app.delete('/api/journal/:id', (req, res) => { db.prepare('DELETE FROM journal WHERE id=?').run(req.params.id); res.json({ ok: true }); });

// Journal Stats
app.get('/api/journal-stats', (req, res) => {
  const q = (s) => db.prepare(s).get();
  const total = q("SELECT COUNT(*) as c FROM journal").c;
  const wins = q("SELECT COUNT(*) as c FROM journal WHERE result='WIN'").c;
  const losses = q("SELECT COUNT(*) as c FROM journal WHERE result='LOSS'").c;
  const be = q("SELECT COUNT(*) as c FROM journal WHERE result='BE'").c;
  res.json({
    total, wins, losses, be,
    winRate: total>0?((wins/(wins+losses+be))*100).toFixed(1):0,
    pnl: q("SELECT COALESCE(SUM(pnl),0) as s FROM journal").s,
    avgRR: q("SELECT COALESCE(AVG(rr_ratio),0) as a FROM journal WHERE result IN ('WIN','LOSS')").a.toFixed(2),
    byPair: db.prepare("SELECT pair, COUNT(*) as cnt, SUM(pnl) as tpnl, SUM(CASE WHEN result='WIN' THEN 1 ELSE 0 END) as w FROM journal GROUP BY pair ORDER BY tpnl DESC").all(),
    dailyPnl: db.prepare("SELECT date, SUM(pnl) as pnl FROM journal GROUP BY date ORDER BY date DESC LIMIT 30").all().reverse()
  });
});

// Watchlist
app.get('/api/watchlist', (req, res) => res.json(db.prepare('SELECT * FROM watchlist ORDER BY updated_at DESC').all()));
app.post('/api/watchlist', (req, res) => {
  const r = db.prepare('INSERT INTO watchlist (pair,bias,h4_trend,notes) VALUES (?,?,?,?)').run(req.body.pair,req.body.bias,req.body.h4_trend,req.body.notes);
  res.json({ id: r.lastInsertRowid });
});
app.delete('/api/watchlist/:id', (req, res) => { db.prepare('DELETE FROM watchlist WHERE id=?').run(req.params.id); res.json({ ok: true }); });

// Daily Review
app.get('/api/daily-review/:date', (req, res) => res.json(db.prepare('SELECT * FROM daily_reviews WHERE date=?').get(req.params.date) || {}));
app.post('/api/daily-review', (req, res) => {
  const b = req.body;
  const exists = db.prepare('SELECT id FROM daily_reviews WHERE date=?').get(b.date);
  if (exists) db.prepare('UPDATE daily_reviews SET total_trades=?,wins=?,losses=?,total_pnl=?,win_rate=?,plan_compliance=?,emotions=?,lessons=?,tomorrow_plan=? WHERE date=?').run(b.total_trades,b.wins,b.losses,b.total_pnl,b.win_rate,b.plan_compliance,b.emotions,b.lessons,b.tomorrow_plan,b.date);
  else db.prepare('INSERT INTO daily_reviews (date,total_trades,wins,losses,total_pnl,win_rate,plan_compliance,emotions,lessons,tomorrow_plan) VALUES (?,?,?,?,?,?,?,?,?,?)').run(b.date,b.total_trades,b.wins,b.losses,b.total_pnl,b.win_rate,b.plan_compliance,b.emotions,b.lessons,b.tomorrow_plan);
  res.json({ ok: true });
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// React fallback (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏦 SMC Academy v3.0 running on port ${PORT}`);
});
