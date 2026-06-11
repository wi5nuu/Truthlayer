const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 3001;

const server = app.listen(PORT, () => {
  console.log(`[TruthLayer] Server running on port ${PORT}`);
});

function gracefulShutdown(signal) {
  console.log(`[TruthLayer] ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('[TruthLayer] Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[TruthLayer] Forced shutdown');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
