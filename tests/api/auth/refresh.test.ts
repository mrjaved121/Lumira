/**
 * Refresh Token API Test Cases
 * POST /api/auth/refresh
 */

import { describe, it, expect } from '@jest/globals';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

describe('POST /api/auth/refresh', () => {
  let refreshToken = '';

  // Setup: Register and login to get a refresh token
  beforeAll(async () => {
    const email = `refresh.test.${Date.now()}@example.com`;
    const password = 'SecurePass123!';

    // Register
    await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Refresh',
        lastName: 'Test',
        email: email,
        password: password,
        role: 'customer',
      }),
    });

    // Login to get tokens
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const loginData = await loginResponse.json();
    refreshToken = loginData.data.refreshToken;
  });

  describe('✅ Valid Refresh Token Tests', () => {
    it('should refresh access token with valid refresh token', async () => {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('token');
      expect(data.data).toHaveProperty('refreshToken');
      expect(data.data.token).not.toBe(refreshToken); // New token should be different
    });
  });

  describe('❌ Invalid Refresh Token Tests', () => {
    it('should fail with invalid refresh token', async () => {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: 'invalid.token.here',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid or expired refresh token');
    });

    it('should fail with missing refresh token', async () => {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
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

    it('should fail with empty refresh token', async () => {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: '',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });
  });
});

