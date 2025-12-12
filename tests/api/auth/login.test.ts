/**
 * Login API Test Cases
 * POST /api/auth/login
 */

import { describe, it, expect } from '@jest/globals';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

describe('POST /api/auth/login', () => {
  let testUserEmail = '';
  let testUserPassword = 'SecurePass123!';

  // Setup: Create a test user before running tests
  beforeAll(async () => {
    testUserEmail = `test.user.${Date.now()}@example.com`;
    
    // Register a test user
    await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: testUserEmail,
        password: testUserPassword,
        role: 'customer',
      }),
    });
  });

  describe('✅ Valid Login Tests', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserEmail,
          password: testUserPassword,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user).toHaveProperty('_id');
      expect(data.data.user.email).toBe(testUserEmail);
      expect(data.data).toHaveProperty('token');
      expect(data.data).toHaveProperty('refreshToken');
      expect(data.data.user).not.toHaveProperty('password');
      expect(data.data.user).not.toHaveProperty('refreshToken');
    });
  });

  describe('❌ Invalid Login Tests', () => {
    it('should fail with wrong password', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserEmail,
          password: 'WrongPassword123!',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should fail with nonexistent user', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent.user@example.com',
          password: 'SomePassword123!',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should fail with missing email', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: testUserPassword,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const emailError = data.details.find((d: any) => d.field === 'email');
      expect(emailError).toBeDefined();
    });

    it('should fail with missing password', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserEmail,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const passwordError = data.details.find((d: any) => d.field === 'password');
      expect(passwordError).toBeDefined();
    });

    it('should fail with invalid email format', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          password: testUserPassword,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const emailError = data.details.find((d: any) => d.field === 'email');
      expect(emailError).toBeDefined();
    });
  });
});

