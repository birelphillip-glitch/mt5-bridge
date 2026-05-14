const express = require('express');
const app = express();

// Allow CORS for your app
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());

// Store live market data from MT5
let liveMarketData = {
    bid: 2650.00,
    ask: 2650.05,
    spread: 5,
    balance: 10000,
    equity: 10000,
    freeMargin: 10000,
    positions: [],
    lastUpdate: null
};

// Endpoint for MT5 to UPDATE data (POST)
app.post('/update', (req, res) => {
    liveMarketData = {
        ...liveMarketData,
        ...req.body,
        lastUpdate: new Date().toISOString()
    };
    console.log(`📊 MT5 Update: Bid=${liveMarketData.bid}, Balance=${liveMarketData.balance}`);
    res.json({ status: 'updated', time: liveMarketData.lastUpdate });
});

// Endpoint for Android app to GET data
app.get('/tick', (req, res) => {
    res.json({
        bid: liveMarketData.bid,
        ask: liveMarketData.ask,
        spread: liveMarketData.spread,
        balance: liveMarketData.balance,
        equity: liveMarketData.equity,
        positions: liveMarketData.positions || []
    });
});

// Endpoint for Android app to SEND trades
app.post('/trade', (req, res) => {
    console.log('📱 Trade received from app:', req.body);
    res.json({ status: 'received', message: 'Trade order received' });
});

// Health check
app.get('/', (req, res) => {
    res.send('MT5 Bridge is running. Last update: ' + (liveMarketData.lastUpdate || 'never'));
});

const PORT = process.env.PORT || 8891;
app.listen(PORT, () => {
    console.log(`✅ Bridge running on port ${PORT}`);
});
