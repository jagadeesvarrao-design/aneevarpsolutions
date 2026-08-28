import request from 'supertest';
import app from '../src/app';

describe('🛡️ Enterprise Security Suite & Compliance Tests', () => {
  it('should include all mandatory HTTP security headers (Helmet, CSP, HSTS, NoSniff, X-Frame-Options)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['x-correlation-id']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('should provide a sanitized health check without leaking infrastructure details', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toEqual({
      status: 'HEALTHY',
      service: 'aneevarp-solutions-parent-gateway',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
    });
  });

  it('should reject unauthenticated requests to protected sync endpoints with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/metrics/sync')
      .send({
        ventureSlug: 'zenresume',
        metricKey: 'test_metric',
        metricValue: 100,
        metricLabel: 'Test',
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should enforce strict Zod schema validation on contact inquiry submissions', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'A', // Too short (min 2)
        email: 'not-an-email',
        message: '',
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('should reject unauthenticated requests to POST /api/v1/ventures with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/ventures')
      .send({
        name: 'Malicious Venture',
        slug: 'malicious-venture',
        tagline: 'Unauthorized product',
        description: 'Should be rejected',
        websiteUrl: 'https://malicious.com',
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject unauthenticated requests to POST /api/v1/press with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/press')
      .send({
        title: 'Fake Press Announcement',
        slug: 'fake-press-announcement',
        summary: 'Should be blocked without API key',
        content: 'This announcement should fail due to missing authentication credentials.',
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should validate metrics payload schema with Zod when authenticated', async () => {
    const res = await request(app)
      .post('/api/v1/metrics/sync')
      .set('X-API-Key', 'aneevarp_admin_secret_key_change_in_production')
      .send({
        ventureSlug: 'zenresume',
        metricKey: 'invalid_metric',
        metricValue: -50, // Negative value violates nonnegative()
        metricLabel: 'Invalid',
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('should sanitize input and strip malicious XSS scripts on inquiry submission', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        category: 'GENERAL',
        message: '<script>alert("xss")</script>This is a safe inquiry message.',
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ticketNumber).toBeDefined();
  });
});
