import { env } from '../config/env';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Aneevarp Solutions — Parent Corporate Platform API',
    version: '1.0.0',
    description:
      'Official REST API platform for Aneevarp Solutions (Parent Holding Entity governing ZenResume, ZenScout AI, ZenDoc AI, Corporate Governance, Unified Careers, Newsroom Press, and Live Ecosystem Telemetry).',
    contact: {
      name: 'Aneevarp Solutions Tech Office',
      url: 'https://aneevarpsolutions.vercel.app',
      email: 'support@zenresume.com',
    },
  },
  servers: [
    {
      url: 'https://aneevarpsolutions.vercel.app',
      description: 'Production Global API Gateway (Vercel)',
    },
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Local Development Server',
    },
  ],
  tags: [
    { name: 'Ventures', description: 'Portfolio ventures & product showcase (ZenResume, ZenScout AI, ZenDoc AI, Cloud Labs)' },
    { name: 'Press & Newsroom', description: 'Corporate announcements, releases, & official brand media kit' },
    { name: 'Careers & Talent Desk', description: 'Cross-venture job positions & talent inquiries' },
    { name: 'Governance & IR', description: 'Corporate mission, leadership board, capital structure & policies' },
    { name: 'Contact & Venture Pitch', description: 'Multi-channel inquiry routing & venture studio proposals' },
    { name: 'Ecosystem Telemetry', description: 'Real-time aggregated portfolio telemetry & sync endpoints' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Ecosystem Telemetry'],
        summary: 'System health check endpoint',
        responses: {
          '200': {
            description: 'Server is operational',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/api/v1/ventures': {
      get: {
        tags: ['Ventures'],
        summary: 'List all portfolio ventures',
        parameters: [
          { name: 'stage', in: 'query', schema: { type: 'string', enum: ['LIVE', 'BETA', 'INCUBATING'] } },
          { name: 'featuredOnly', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: { '200': { description: 'List of portfolio ventures' } },
      },
    },
    '/api/v1/ventures/{slug}': {
      get: {
        tags: ['Ventures'],
        summary: 'Get details for a specific venture',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Venture details' }, '404': { description: 'Venture not found' } },
      },
    },
    '/api/v1/press': {
      get: {
        tags: ['Press & Newsroom'],
        summary: 'List corporate press releases',
        parameters: [{ name: 'category', in: 'query', schema: { type: 'string' } }],
        responses: { '200': { description: 'List of press releases' } },
      },
    },
    '/api/v1/press/media-kit': {
      get: {
        tags: ['Press & Newsroom'],
        summary: 'Get official brand assets & media kit',
        responses: { '200': { description: 'Official media kit' } },
      },
    },
    '/api/v1/careers': {
      get: {
        tags: ['Careers & Talent Desk'],
        summary: 'List active career opportunities',
        responses: { '200': { description: 'List of open positions' } },
      },
    },
    '/api/v1/careers/apply': {
      post: {
        tags: ['Careers & Talent Desk'],
        summary: 'Submit candidate application',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['postingId', 'applicantName', 'applicantEmail'],
                properties: {
                  postingId: { type: 'string' },
                  applicantName: { type: 'string' },
                  applicantEmail: { type: 'string' },
                  resumeUrl: { type: 'string' },
                  portfolioUrl: { type: 'string' },
                  coverLetter: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Application received' } },
      },
    },
    '/api/v1/governance/overview': {
      get: {
        tags: ['Governance & IR'],
        summary: 'Corporate overview & mission statement',
        responses: { '200': { description: 'Governance overview' } },
      },
    },
    '/api/v1/governance/team': {
      get: {
        tags: ['Governance & IR'],
        summary: 'Executive leadership & advisory board',
        responses: { '200': { description: 'List of team leaders' } },
      },
    },
    '/api/v1/governance/policies': {
      get: {
        tags: ['Governance & IR'],
        summary: 'Corporate policies & AI ethics charter',
        parameters: [{ name: 'type', in: 'query', schema: { type: 'string', enum: ['PRIVACY', 'TERMS', 'AI_ETHICS', 'ESG', 'GOVERNANCE'] } }],
        responses: { '200': { description: 'Corporate policies' } },
      },
    },
    '/api/v1/contact/categories': {
      get: {
        tags: ['Contact & Venture Pitch'],
        summary: 'Get list of inquiry routing categories',
        responses: { '200': { description: 'Inquiry categories' } },
      },
    },
    '/api/v1/contact': {
      post: {
        tags: ['Contact & Venture Pitch'],
        summary: 'Submit general inquiry or venture pitch',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'message'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  company: { type: 'string' },
                  category: { type: 'string', enum: ['GENERAL', 'PARTNERSHIP', 'ENTERPRISE_LICENSING', 'PRESS_MEDIA', 'INVESTOR_RELATIONS', 'CAREERS', 'VENTURE_PITCH'] },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Inquiry submitted successfully' } },
      },
    },
    '/api/v1/metrics/live': {
      get: {
        tags: ['Ecosystem Telemetry'],
        summary: 'Get live aggregated ecosystem metrics',
        responses: { '200': { description: 'Live telemetry metrics' } },
      },
    },
    '/api/v1/metrics/sync': {
      post: {
        tags: ['Ecosystem Telemetry'],
        summary: 'Sync metric telemetry from child venture (ZenResume, AI Job Agent, PDF Bot)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ventureSlug', 'metricKey', 'metricValue', 'metricLabel'],
                properties: {
                  ventureSlug: { type: 'string' },
                  metricKey: { type: 'string' },
                  metricValue: { type: 'number' },
                  metricLabel: { type: 'string' },
                  unit: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Metric synced successfully' } },
      },
    },
  },
};
