/**
 * Forgot Password API Test Cases
 * POST /api/auth/forgot-password
 */

import { describe, it, expect } from '@jest/globals';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

describe('POST /api/auth/forgot-password', () => {
  let testUserEmail = '';

  // Setup: Create a test user
  beforeAll(async () => {
    testUserEmail = `forgot.test.${Date.now()}@example.com`;
    
    await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Forgot',
        lastName: 'Test',
        email: testUserEmail,
        password: 'SecurePass123!',
        role: 'customer',
      }),
    });
  });

  describe('✅ Valid Forgot Password Tests', () => {
    it('should return success for existing email', async () => {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserEmail,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('password reset email');
    });

    it('should return success even for nonexistent email (security)', async () => {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent.email@example.com',
        }),
      });

      const data = await response.json();

      // Should still return 200 for security (don't reveal if email exists)
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('password reset email');
    });
  });

  describe('❌ Invalid Forgot Password Tests', () => {
    it('should fail with missing email', async () => {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should fail with invalid email format', async () => {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should fail with empty email', async () => {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: '',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });
  });
});

