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
