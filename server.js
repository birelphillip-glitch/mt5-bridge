const express = require('express');
const app = express();
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

// Endpoint for MT5 to UPDATE market data (for future use)
app.post('/update', (req, res) => {
  marketData = { ...marketData, ...req.body };
  console.log('Market data updated:', marketData.bid);
  res.json({ status: 'updated' });
});

// Basic home route to confirm the service is alive
app.get('/', (req, res) => {
  res.send('MT5 Bridge is running. Use /tick endpoint.');
});

// Listen on the port Render provides
const PORT = process.env.PORT || 8891;
app.listen(PORT, () => {
  console.log(`✅ Bridge running on port ${PORT}`);
});
