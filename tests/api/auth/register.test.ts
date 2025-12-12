/**
 * Registration API Test Cases
 * POST /api/auth/register
 * 
 * Run with: npm test -- tests/api/auth/register.test.ts
 * Or use the test runner of your choice
 */

import { describe, it, expect } from '@jest/globals';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

describe('POST /api/auth/register', () => {
  describe('✅ Valid Registration Tests', () => {
    it('should register a new customer successfully', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: `john.doe.${Date.now()}@example.com`, // Unique email
          password: 'SecurePass123!',
          role: 'customer',
          phone: '+1-514-555-1234',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.user).toHaveProperty('_id');
      expect(data.data.user.firstName).toBe('John');
      expect(data.data.user.lastName).toBe('Doe');
      expect(data.data.user.email).toContain('john.doe');
      expect(data.data.user.role).toBe('customer');
      expect(data.data.user.emailVerified).toBe(false);
      expect(data.data).toHaveProperty('token');
      expect(data.data).toHaveProperty('refreshToken');
      expect(data.data.user).not.toHaveProperty('password');
      expect(data.data.user).not.toHaveProperty('refreshToken');
    });

    it('should register a new photographer successfully', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: `jane.smith.${Date.now()}@example.com`, // Unique email
          password: 'SecurePass123!',
          role: 'photographer',
          phone: '+1-514-555-5678',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.user.role).toBe('photographer');
      expect(data.data.user.firstName).toBe('Jane');
      expect(data.data.user.lastName).toBe('Smith');
    });
  });

  describe('❌ Invalid Registration Tests', () => {
    it('should fail when required fields are missing', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          // Missing firstName, lastName, password
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeInstanceOf(Array);
      expect(data.details.length).toBeGreaterThan(0);
      
      // Check that error details mention missing fields
      const fieldNames = data.details.map((d: any) => d.field);
      expect(fieldNames).toContain('firstName');
      expect(fieldNames).toContain('lastName');
      expect(fieldNames).toContain('password');
    });

    it('should fail with invalid email format', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'invalid-email', // Invalid email format
          password: 'SecurePass123!',
          role: 'customer',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const emailError = data.details.find((d: any) => d.field === 'email');
      expect(emailError).toBeDefined();
      expect(emailError.message).toContain('email');
    });

    it('should fail with password too short', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: `test.${Date.now()}@example.com`,
          password: '123', // Too short (less than 6 characters)
          role: 'customer',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const passwordError = data.details.find((d: any) => d.field === 'password');
      expect(passwordError).toBeDefined();
      expect(passwordError.message).toContain('6');
    });

    it('should fail with duplicate email', async () => {
      // First, register a user
      const email = `duplicate.${Date.now()}@example.com`;
      
      const firstResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'First',
          lastName: 'User',
          email: email,
          password: 'SecurePass123!',
          role: 'customer',
        }),
      });

      expect(firstResponse.status).toBe(201);

      // Try to register again with the same email
      const secondResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Second',
          lastName: 'User',
          email: email, // Same email
          password: 'SecurePass123!',
          role: 'customer',
        }),
      });

      const data = await secondResponse.json();

      expect(secondResponse.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User with this email already exists');
    });

    it('should fail with invalid role', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: `test.${Date.now()}@example.com`,
          password: 'SecurePass123!',
          role: 'invalid_role', // Invalid role
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const roleError = data.details.find((d: any) => d.field === 'role');
      expect(roleError).toBeDefined();
    });

    it('should fail with firstName exceeding max length', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'A'.repeat(101), // Exceeds 100 character limit
          lastName: 'User',
          email: `test.${Date.now()}@example.com`,
          password: 'SecurePass123!',
          role: 'customer',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const firstNameError = data.details.find((d: any) => d.field === 'firstName');
      expect(firstNameError).toBeDefined();
      expect(firstNameError.message).toContain('100');
    });

    it('should fail with invalid phone number format', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: `test.${Date.now()}@example.com`,
          password: 'SecurePass123!',
          role: 'customer',
          phone: 'invalid-phone-format!!!', // Invalid phone format
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      
      const phoneError = data.details.find((d: any) => d.field === 'phone');
      expect(phoneError).toBeDefined();
    });
  });
});

