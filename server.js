const express = require('express');
const app = express();

// THIS FIXES THE CONNECTION ISSUE - Allow all apps to connect
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Initial market data
let marketData = {
    bid: 2650.00,
    ask: 2650.05,
    spread: 5,
    balance: 10000,
    equity: 10000,
    positions: []
};

// Endpoint for Android app to GET market data
app.get('/tick', (req, res) => {
    res.json(marketData);
});

// Endpoint for Android app to SEND trades
app.post('/trade', (req, res) => {
    console.log('Trade received:', req.body);
    res.json({ status: 'received', message: 'Trade order received' });
});

// Endpoint for MT5 to UPDATE market data
app.post('/update', (req, res) => {
    marketData = { ...marketData, ...req.body };
    console.log('Market data updated:', marketData.bid);
    res.json({ status: 'updated' });
});

// Basic home route
app.get('/', (req, res) => {
    res.send('MT5 Bridge is running. Use /tick endpoint.');
});

// Listen on the port Render provides
const PORT = process.env.PORT || 8891;
app.listen(PORT, () => {
    console.log(`✅ Bridge running on port ${PORT}`);
    console.log(`📱 Android app should connect to: https://your-render-url.onrender.com`);
});
