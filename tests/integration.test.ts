import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database/client';

describe('Aneevarp Solutions Backend API Integration Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /health - should return status HEALTHY', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
  });

  it('GET /api/v1/ventures - should return portfolio ventures', async () => {
    const res = await request(app).get('/api/v1/ventures');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/ventures/zenresume - should return ZenResume venture details', async () => {
    const res = await request(app).get('/api/v1/ventures/zenresume');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('zenresume');
    expect(res.body.data.websiteUrl).toBe('https://zenresume.online');
  });

  it('GET /api/v1/press - should return press releases', async () => {
    const res = await request(app).get('/api/v1/press');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/press/media-kit - should return official media kit', async () => {
    const res = await request(app).get('/api/v1/press/media-kit');
    expect(res.status).toBe(200);
    expect(res.body.data.companyName).toBe('Aneevarp Solutions Private Limited');
  });

  it('GET /api/v1/careers - should return active job postings', async () => {
    const res = await request(app).get('/api/v1/careers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/governance/overview - should return corporate overview', async () => {
    const res = await request(app).get('/api/v1/governance/overview');
    expect(res.status).toBe(200);
    expect(res.body.data.companyName).toBe('Aneevarp Solutions Private Limited');
    expect(res.body.data.cin).toBe('U72900TG2026PTC184920');
  });

  it('GET /api/v1/contact/categories - should return inquiry categories', async () => {
    const res = await request(app).get('/api/v1/contact/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/contact - should submit contact inquiry successfully', async () => {
    const res = await request(app).post('/api/v1/contact').send({
      name: 'John Partner',
      email: 'john@enterprise.com',
      company: 'Enterprise AI Corp',
      category: 'PARTNERSHIP',
      message: 'We are interested in integrating ZenResume API into our platform.',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ticketNumber).toBeDefined();
  });

  it('GET /api/v1/metrics/live - should return live aggregated metrics', async () => {
    const res = await request(app).get('/api/v1/metrics/live');
    expect(res.status).toBe(200);
    expect(res.body.data.parentCompany).toBe('Aneevarp Solutions');
    expect(res.body.data.totals).toHaveProperty('resumesGenerated');
  });
});
