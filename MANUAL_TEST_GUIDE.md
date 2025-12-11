# 🧪 Manual Testing Guide for Login API

## Prerequisites
1. Make sure your development server is running:
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:3000`

2. Make sure MongoDB is running and connected (check your `.env.local` file)

## Testing Methods

### Option 1: Using Thunder Client (VS Code Extension) - Recommended

1. Install Thunder Client extension in VS Code
2. Open Thunder Client from the sidebar
3. Follow the tests below

### Option 2: Using Postman

1. Open Postman
2. Create a new collection called "Lumira Auth APIs"
3. Follow the tests below

### Option 3: Using Browser (for GET requests only)

Some endpoints can be tested directly in the browser, but POST requests need a tool.

---

## Test Cases

### Test 1: Register a User (if not already done)

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Note:** If user already exists, you'll get a 400 error. That's okay, continue to Test 2.

---

### Test 2: Login with Valid Credentials

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "customer",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**✅ Save the `token` value - you'll need it for Test 3!**

---

### Test 3: Get Current User (Protected Route)

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
  (Replace `YOUR_TOKEN_HERE` with the token from Test 2)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**Test without token:**
- Remove the Authorization header
- **Expected Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "error": "No token provided"
  }
  ```

---

### Test 4: Login with Invalid Password

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "email": "test@example.com",
    "password": "wrongpassword"
  }
  ```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### Test 5: Login with Invalid Email

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "email": "nonexistent@example.com",
    "password": "password123"
  }
  ```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### Test 6: Login with Invalid Data Format

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "email": "not-an-email",
    "password": "123"
  }
  ```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

### Test 7: Login with Missing Fields

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
    "email": "test@example.com"
  }
  ```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password is required"
    }
  ]
}
```

---

## ✅ Verification Checklist

After running all tests, verify:

- [ ] ✅ Test 2: Login with valid credentials returns 200 with tokens
- [ ] ✅ Test 3: `/me` endpoint works with valid token
- [ ] ✅ Test 3: `/me` endpoint rejects requests without token (401)
- [ ] ✅ Test 4: Login with invalid password returns 401
- [ ] ✅ Test 5: Login with invalid email returns 401
- [ ] ✅ Test 6: Login with invalid format returns 400 with validation details
- [ ] ✅ Test 7: Login with missing password returns 400
- [ ] ✅ Token is a valid JWT string (starts with `eyJ`)
- [ ] ✅ User object doesn't contain `password` or `refreshToken` fields

---

## 🐛 Troubleshooting

### Server not responding?
- Check if `npm run dev` is running
- Check if port 3000 is available
- Check console for errors

### Database connection errors?
- Verify MongoDB is running
- Check `.env.local` has correct `MONGODB_URI`
- Verify connection string format

### 401 Unauthorized errors?
- Make sure you're using the correct token
- Check token format: `Bearer <token>` (with space)
- Token might be expired (default: 7 days)

### Validation errors?
- Check request body format (must be valid JSON)
- Check Content-Type header is `application/json`
- Verify all required fields are present

---

## 📝 Next Steps

Once all tests pass:
1. ✅ Login API is working correctly
2. ✅ `/me` endpoint is working correctly
3. Ready to implement:
   - `POST /api/auth/refresh` - Refresh token
   - `POST /api/auth/logout` - Logout



