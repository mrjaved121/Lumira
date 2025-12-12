/**
 * Google OAuth API Test Cases
 * POST /api/auth/google
 */

import { describe, it, expect } from '@jest/globals';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

describe('POST /api/auth/google', () => {
  describe('✅ Valid Google OAuth Tests', () => {
    it('should register a new user via Google OAuth', async () => {
      const googleId = `google_${Date.now()}`;
      const email = `google.user.${Date.now()}@example.com`;

      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: googleId,
          email: email,
          name: 'Google User',
          profilePicture: 'https://lh3.googleusercontent.com/a/default-user',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user).toHaveProperty('_id');
      expect(data.data.user.email).toBe(email);
      expect(data.data.user.googleId).toBe(googleId);
      expect(data.data.user.emailVerified).toBe(true);
      expect(data.data).toHaveProperty('token');
      expect(data.data).toHaveProperty('refreshToken');
    });

    it('should login existing user via Google OAuth', async () => {
      const googleId = `google_${Date.now()}`;
      const email = `existing.google.${Date.now()}@example.com`;

      // First, create user via Google OAuth
      await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: googleId,
          email: email,
          name: 'Existing Google User',
        }),
      });

      // Try to login again with same Google ID
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: googleId,
          email: email,
          name: 'Existing Google User',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe(email);
    });

    it('should link Google account to existing email user', async () => {
      const email = `link.test.${Date.now()}@example.com`;
      const password = 'SecurePass123!';

      // First, register with email/password
      await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Link',
          lastName: 'Test',
          email: email,
          password: password,
          role: 'customer',
        }),
      });

      // Then link Google account
      const googleId = `google_link_${Date.now()}`;
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: googleId,
          email: email,
          name: 'Link Test User',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe(email);
      expect(data.data.user.googleId).toBe(googleId);
    });
  });

  describe('❌ Invalid Google OAuth Tests', () => {
    it('should fail with missing googleId', async () => {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should fail with missing email', async () => {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: '123456789',
          name: 'Test User',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should fail with invalid email format', async () => {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: '123456789',
          email: 'invalid-email',
          name: 'Test User',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should fail with invalid profile picture URL', async () => {
      const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: `google_${Date.now()}`,
          email: `test.${Date.now()}@example.com`,
          name: 'Test User',
          profilePicture: 'not-a-valid-url',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });
  });
});

