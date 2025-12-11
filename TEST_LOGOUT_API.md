# 🧪 Testing the Logout API

## Overview
The Logout API allows users to securely log out by invalidating their refresh token. Once logged out, the user cannot refresh their access token and will need to login again.

## How Logout Works

1. **User sends logout request** → With their access token
2. **Server verifies token** → Confirms user identity
3. **Server clears refresh token** → Removes it from database
4. **User is logged out** → Cannot refresh tokens anymore
5. **Access token still valid** → Until it expires naturally (soft logout)

**Note:** This is a "soft logout" - the access token remains valid until it expires. For a "hard logout" (immediate token invalidation), you'd need a token blacklist system (more complex).

---

## Prerequisites

Before testing the logout endpoint, you need:
1. A logged-in user (with valid access token)
2. The access token must be valid (not expired)

---

## Test Cases

### Test 1: Logout with Valid Token

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
- **Save the `token` and `refreshToken` from the response**

**Step 2:** Logout using the access token:
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`
- **Headers:**
  ```
  Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
  ```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Step 3:** Verify logout worked - try to refresh token:
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "YOUR_OLD_REFRESH_TOKEN"
  }
  ```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid refresh token. Please login again."
}
```

**✅ This confirms logout worked!** The refresh token was invalidated.

---

### Test 2: Logout Without Token

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`
- **No Authorization header**

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "No token provided"
}
```

---

### Test 3: Logout with Invalid Token

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`
- **Headers:**
  ```
  Authorization: Bearer invalid-token-here
  ```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

### Test 4: Logout with Expired Token

If you have an expired access token:

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/logout`
- **Headers:**
  ```
  Authorization: Bearer EXPIRED_TOKEN
  ```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

### Test 5: Verify Access Token Still Works After Logout

**Important:** After logout, the access token is still valid until it expires. This is expected behavior for "soft logout".

**Step 1:** Login and get tokens
**Step 2:** Logout (invalidate refresh token)
**Step 3:** Try to use access token:

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer ACCESS_TOKEN_FROM_BEFORE_LOGOUT
  ```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

**Why?** The access token is still valid. Only the refresh token was invalidated. This is a "soft logout" - the user can still use the app until the access token expires.

---

### Test 6: Complete Logout Flow

Test the complete user journey:

1. **Login** → Get tokens
2. **Use access token** → Call `/api/auth/me` (should work)
3. **Logout** → Invalidate refresh token
4. **Try to refresh** → Should fail (refresh token invalidated)
5. **Try to use access token** → Still works (until it expires)
6. **Login again** → Get new tokens

---

## ✅ Verification Checklist

After running all tests, verify:

- [ ] ✅ Test 1: Logout with valid token returns success (200)
- [ ] ✅ Test 1: Refresh token is invalidated after logout
- [ ] ✅ Test 2: Logout without token returns 401
- [ ] ✅ Test 3: Logout with invalid token returns 401
- [ ] ✅ Test 4: Logout with expired token returns 401
- [ ] ✅ Test 5: Access token still works after logout (soft logout behavior)

---

## 🔄 Typical User Flow

1. **User logs in** → Gets access token + refresh token
2. **User uses app** → Makes API calls with access token
3. **User clicks logout** → Calls logout API
4. **Refresh token invalidated** → Cannot get new tokens
5. **Access token still valid** → Can continue using until it expires
6. **Access token expires** → User must login again

---

## 📝 Notes

### Soft Logout vs Hard Logout

**Soft Logout (Current Implementation):**
- ✅ Simple to implement
- ✅ No token blacklist needed
- ✅ Access token remains valid until expiration
- ⚠️ User can still use app until access token expires

**Hard Logout (Advanced):**
- ✅ Immediate token invalidation
- ✅ Requires token blacklist/revocation system
- ⚠️ More complex to implement
- ⚠️ Requires additional storage (Redis, database)

**Recommendation:** Soft logout is sufficient for most applications. Access tokens are short-lived (7 days), so the window of vulnerability is small.

### Security Considerations

1. **Refresh Token Invalidation:** Prevents new token generation after logout
2. **Access Token Expiration:** Natural expiration provides additional security
3. **Token Storage:** Store tokens securely (httpOnly cookies recommended for web apps)
4. **Multiple Devices:** Each device has its own refresh token, logout only affects current device

---

## 🐛 Troubleshooting

### "No token provided"
- Make sure you're sending the Authorization header
- Format: `Authorization: Bearer <token>` (with space)

### "Invalid or expired token"
- Token might be expired
- Token might be malformed
- Token signature doesn't match

### Refresh token still works after logout
- Check that logout actually cleared the refresh token in database
- Verify the refresh token you're using is the one that was logged out

---

## 📝 Next Steps

Once logout API is working:
1. ✅ **Phase 1: Core Authentication is COMPLETE!**
   - ✅ POST /api/auth/register
   - ✅ POST /api/auth/login
   - ✅ GET /api/auth/me
   - ✅ POST /api/auth/refresh
   - ✅ POST /api/auth/logout

2. **Ready for Phase 2: User Management APIs**
   - GET /api/users/me
   - PUT /api/users/me
   - PATCH /api/users/me/password
   - etc.

---

## 🎉 Congratulations!

You've completed all core authentication APIs! These are the foundation of your authentication system. Users can now:
- Register accounts
- Login securely
- Get their profile
- Refresh tokens
- Logout securely

Next, we'll build user management features!

