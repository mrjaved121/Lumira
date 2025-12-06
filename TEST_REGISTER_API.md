# 🧪 Testing Registration API

## API Endpoint
**POST** `/api/auth/register`

## How to Test

### Option 1: Using Browser (Not Recommended - Use Postman/Thunder Client)
Browsers can only do GET requests, so use one of the options below.

### Option 2: Using Thunder Client (VS Code Extension)
1. Install Thunder Client extension in VS Code
2. Create new request
3. Set method to `POST`
4. Set URL to: `http://localhost:3000/api/auth/register`
5. Set Headers:
   - `Content-Type: application/json`
6. Set Body (JSON):
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "customer",
     "phone": "+1234567890"
   }
   ```
7. Click "Send"
8. Check response

### Option 3: Using Postman
1. Open Postman
2. Create new POST request
3. URL: `http://localhost:3000/api/auth/register`
4. Go to "Body" tab
5. Select "raw" and "JSON"
6. Paste JSON body (same as above)
7. Click "Send"

### Option 4: Using curl (Terminal)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

## Test Cases

### ✅ Test 1: Successful Registration
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### ❌ Test 2: Duplicate Email
**Request:**
```json
{
  "name": "Jane Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

### ❌ Test 3: Invalid Email
**Request:**
```json
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "password123",
  "role": "customer"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### ❌ Test 4: Short Password
**Request:**
```json
{
  "name": "John Doe",
  "email": "test@example.com",
  "password": "123",
  "role": "customer"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### ❌ Test 5: Missing Required Fields
**Request:**
```json
{
  "email": "test@example.com"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name must be at least 2 characters"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### ✅ Test 6: Register as Photographer
**Request:**
```json
{
  "name": "Photographer Name",
  "email": "photographer@example.com",
  "password": "password123",
  "role": "photographer"
}
```

**Expected Response:** `201 Created` (same format as Test 1, but role is "photographer")

## Success Indicators

✅ **Success:**
- Status code: 201
- `success: true` in response
- User object returned (without password)
- Token and refreshToken returned
- User saved in database

❌ **Failure:**
- Status code: 400 or 500
- `success: false` in response
- Error message explains the issue

## Troubleshooting

### Error: "MONGODB_URI environment variable not defined"
**Solution:** Make sure `.env.local` exists with MongoDB connection string

### Error: "JWT_SECRET is not defined"
**Solution:** Add `JWT_SECRET` to `.env.local`

### Error: "User model not found"
**Solution:** Make sure User model is exported from `lib/models/index.ts`

### Error: "Cannot find module '@/lib/utils/jwt'"
**Solution:** Restart dev server after creating new files

## Next Steps After Testing

Once registration works:
1. ✅ Test login API (to be created)
2. ✅ Test token verification
3. ✅ Test protected routes

