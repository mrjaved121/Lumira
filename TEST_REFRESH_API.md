# 🧪 Testing the Refresh Token API

## Overview
The Refresh Token API allows users to get a new access token when their current one expires. This is essential for maintaining user sessions without requiring them to log in again.

## How Refresh Tokens Work

1. **Access Token** - Short-lived (default: 7 days), used for API requests
2. **Refresh Token** - Long-lived (default: 30 days), used to get new access tokens
3. When access token expires → Use refresh token to get a new one
4. When refresh token expires → User must login again

---

## Prerequisites

Before testing the refresh endpoint, you need:
1. A valid refresh token (obtained from login or register)
2. The refresh token must not be expired
3. The user account must be active

---

## Test Cases

### Test 1: Refresh Token with Valid Refresh Token

**Step 1:** First, login to get tokens:
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body:**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Save the `refreshToken` from the response**

**Step 2:** Use the refresh token:
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }
  ```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

**✅ Important Notes:**
- You get a NEW access token
- You also get a NEW refresh token (old one is invalidated)
- Save the new tokens for future use

---

### Test 2: Use New Token to Access Protected Route

After refreshing, test that the new token works:

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer NEW_TOKEN_FROM_REFRESH
  ```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

---

### Test 3: Refresh with Invalid Token

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "invalid-token-here"
  }
  ```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid or expired refresh token"
}
```

---

### Test 4: Refresh with Expired Token

If you have an expired refresh token (older than 30 days), test it:

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "EXPIRED_REFRESH_TOKEN"
  }
  ```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid or expired refresh token"
}
```

---

### Test 5: Refresh with Missing Token

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh`
- **Body:**
  ```json
  {}
  ```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "refreshToken",
      "message": "Refresh token is required"
    }
  ]
}
```

---

### Test 6: Refresh with Empty Token

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": ""
  }
  ```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "refreshToken",
      "message": "Refresh token is required"
    }
  ]
}
```

---

### Test 7: Refresh After User Account is Suspended

**Note:** This requires admin access to suspend a user. For now, just understand the behavior:

If a user's account is suspended, even with a valid refresh token:

**Expected Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "Your account has been suspended. Please contact support."
}
```

---

### Test 8: Security Check - Old Refresh Token After Refresh

This is an important security test:

1. Get a refresh token from login
2. Use it to refresh → Get new tokens
3. Try to use the OLD refresh token again

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid refresh token. Please login again."
}
```

**Why?** When you refresh, the old refresh token is invalidated. This prevents token reuse attacks.

---

## ✅ Verification Checklist

After running all tests, verify:

- [ ] ✅ Test 1: Valid refresh token returns new tokens (200)
- [ ] ✅ Test 2: New token works with protected routes
- [ ] ✅ Test 3: Invalid token is rejected (401)
- [ ] ✅ Test 4: Expired token is rejected (401)
- [ ] ✅ Test 5: Missing token returns validation error (400)
- [ ] ✅ Test 6: Empty token returns validation error (400)
- [ ] ✅ Test 8: Old refresh token is invalidated after refresh

---

## 🔄 Typical User Flow

1. **User logs in** → Gets access token (7 days) + refresh token (30 days)
2. **User makes API calls** → Uses access token in Authorization header
3. **Access token expires** → API returns 401
4. **App automatically refreshes** → Uses refresh token to get new access token
5. **User continues using app** → With new access token
6. **Repeat steps 3-5** until refresh token expires
7. **Refresh token expires** → User must login again

---

## 📝 Notes

- **Token Rotation:** Each refresh generates a NEW refresh token (old one is invalidated)
- **Security:** Old refresh tokens cannot be reused (prevents replay attacks)
- **Expiration:** 
  - Access token: 7 days (configurable via `JWT_EXPIRE`)
  - Refresh token: 30 days (configurable via `JWT_REFRESH_EXPIRE`)
- **Best Practice:** Store tokens securely (not in localStorage for sensitive apps)

---

## 🐛 Troubleshooting

### "Invalid or expired refresh token"
- Token might be expired (check `JWT_REFRESH_EXPIRE` setting)
- Token might be malformed
- Token signature doesn't match (wrong `JWT_REFRESH_SECRET`)

### "Invalid refresh token. Please login again."
- You're trying to use an old refresh token after it was already used
- This is expected behavior - refresh tokens are rotated for security

### "User not found"
- The user ID in the token doesn't exist in database
- User might have been deleted

---

## 📝 Next Steps

Once refresh token API is working:
1. ✅ Refresh token API is working correctly
2. Ready to implement:
   - `POST /api/auth/logout` - Logout user (invalidate refresh token)

