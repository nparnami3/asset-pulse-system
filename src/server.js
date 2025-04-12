
// Add a root path handler to server.js
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API server is running. Available endpoints: /api/health, /api/assets' });
});
