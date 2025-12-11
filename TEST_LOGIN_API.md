# 🧪 Testing the Login API

## Step 1: Test Registration (if you haven't already)

First, make sure you have a user registered. Test the register endpoint:

```bash
# Using curl (PowerShell)
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"customer\"}'
```

Or use Postman/Thunder Client:
- **Method:** POST
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "customer"
}
```

## Step 2: Test Login with Valid Credentials

### Using curl (PowerShell):
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

### Using Postman/Thunder Client:
- **Method:** POST
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Expected Success Response (200 OK):
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
  "message": "Login successful"
}
```

## Step 3: Test Login with Invalid Email

```json
{
  "email": "wrong@example.com",
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

## Step 4: Test Login with Invalid Password

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

## Step 5: Test Login with Invalid Data Format

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

## Step 6: Test Login with Missing Fields

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

## ✅ Verification Checklist

- [ ] Login with valid credentials returns 200 with tokens
- [ ] Login with invalid email returns 401
- [ ] Login with invalid password returns 401
- [ ] Login with invalid email format returns 400
- [ ] Login with missing password returns 400
- [ ] Token is a valid JWT string
- [ ] Refresh token is a valid JWT string
- [ ] User object doesn't contain password or refreshToken

## 📝 Notes

- Save the `token` from successful login - you'll need it for protected routes
- The token should be sent in the `Authorization` header as: `Bearer <token>`
- Tokens expire after the time specified in `JWT_EXPIRE` (default: 7 days)



