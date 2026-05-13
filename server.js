const express = require('express');
const app = express();
app.use(express.json());

// Store latest market data
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
  res.json({ status: 'received' });
});

// Endpoint for MT5 to UPDATE market data
app.post('/update', (req, res) => {
  marketData = { ...marketData, ...req.body };
  console.log('Market data updated:', marketData.bid);
  res.json({ status: 'updated' });
});

app.listen(8891, () => {
  console.log('✅ Bridge running on port 8891');
  console.log('📱 Android app should connect to: http://localhost:8891');
});