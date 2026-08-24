import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`
===============================================================
🚀 Aneevarp Solutions Parent Corporate Backend is Running!
📡 Port: ${env.PORT}
🌍 Environment: ${env.NODE_ENV}
📚 API Documentation (Swagger UI): http://localhost:${env.PORT}/docs
🔍 Health Check: http://localhost:${env.PORT}/health
===============================================================
  `);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
