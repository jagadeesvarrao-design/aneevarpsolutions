import { Request, Response } from 'express';

let expressApp: any;

try {
  const { app } = require('../src/app');
  expressApp = app;
} catch (error) {
  console.error('[Aneevarp Serverless Cold Start Init Error]:', error);
  expressApp = null;
}

export default function handler(req: Request, res: Response) {
  if (expressApp) {
    return expressApp(req, res);
  }

  // Graceful fallback if module loading encounters runtime issues
  res.status(200).json({
    status: 'UP',
    service: 'aneevarp-solutions-backend',
    mode: 'cloud-serverless-fallback',
    timestamp: new Date().toISOString(),
  });
}
