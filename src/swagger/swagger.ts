import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aneevarp Solutions - Parent Corporate Platform API',
      version: '1.0.0',
      description:
        'Official REST API platform for Aneevarp Solutions (Parent Holding Entity governing ZenResume, AI Job Search Agent, Corporate Governance, Unified Careers, Newsroom Press, and Live Ecosystem Telemetry).',
      contact: {
        name: 'Aneevarp Solutions Tech Office',
        url: 'https://aneevarp.com',
        email: 'tech@aneevarp.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local Development Server',
      },
      {
        url: 'https://api.aneevarp.com',
        description: 'Production Global API Gateway',
      },
    ],
    tags: [
      { name: 'Ventures', description: 'Portfolio ventures & product showcase' },
      { name: 'Press & Newsroom', description: 'Corporate announcements & media kit' },
      { name: 'Careers & Global Job Board', description: 'Cross-venture positions & talent applications' },
      { name: 'Governance & Investor Relations', description: 'Corporate overview, team, & policies' },
      { name: 'Smart Inquiry & Contact Router', description: 'Multi-channel inquiry handling' },
      { name: 'Ecosystem Telemetry & Live Stats', description: 'Real-time aggregated portfolio statistics' },
    ],
  },
  apis: ['./src/modules/**/*.router.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
