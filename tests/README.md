# API Test Suite

This directory contains comprehensive test files for all API endpoints.

## 📁 Test File Types

### 1. Jest Test Files (`.test.ts`)
- **Purpose:** Automated unit/integration tests
- **Run:** `npm test -- tests/api/auth/register.test.ts`
- **Requires:** Jest and testing framework setup

### 2. HTTP Test Files (`.http`)
- **Purpose:** Manual testing with REST Client extension
- **Usage:** Open in VS Code with REST Client extension installed
- **Advantage:** Easy to run individual tests, see responses immediately

### 3. Postman Collections (`.postman.json`)
- **Purpose:** Import into Postman for organized testing
- **Usage:** Import file into Postman
- **Advantage:** Shareable, organized, can save responses

### 4. Shell Scripts (`.sh`)
- **Purpose:** Command-line testing
- **Run:** `bash tests/api/auth/register.sh`
- **Advantage:** Can be integrated into CI/CD pipelines

## 🚀 Quick Start

### Option 1: HTTP Files (Recommended for Quick Testing)
1. Install REST Client extension in VS Code
2. Open any `.http` file
3. Click "Send Request" above each request
4. View response in output panel

### Option 2: Postman
1. Import `.postman.json` files into Postman
2. Set `baseUrl` variable to `http://localhost:3000/api`
3. Run requests individually or as a collection

### Option 3: Shell Scripts
```bash
# Make script executable
chmod +x tests/api/auth/register.sh

# Run the script
./tests/api/auth/register.sh
```

### Option 4: Jest Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/api/auth/register.test.ts
```

## 📋 Test Coverage

### Authentication APIs
- ✅ Registration (`register.test.ts`, `register.http`, `register.postman.json`, `register.sh`)
- ✅ Login (`login.test.ts`, `login.http`, `login.postman.json`, `login.sh`)
- ✅ Google OAuth (`google.test.ts`, `google.http`)
- ✅ Refresh Token (`refresh.test.ts`, `refresh.http`)
- ✅ Forgot Password (`forgot-password.test.ts`, `forgot-password.http`)
- ✅ Reset Password (`reset-password.http`)
- ✅ Logout (`logout.http`)
- ✅ Get Current User (`me.http`)

### User Management APIs
- ✅ User Profile (`users/me.http` - GET and PUT)

### Other APIs
- ⏳ Photographer APIs (coming soon)
- ⏳ Booking APIs (coming soon)
- ⏳ Review APIs (coming soon)
- ⏳ Collection APIs (coming soon)
- ⏳ Conversation/Message APIs (coming soon)

## 🔧 Prerequisites

1. **Server Running:**
   ```bash
   npm run dev
   ```

2. **Database Connected:**
   - MongoDB should be running
   - Connection string in `.env` file

3. **Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```

## 📝 Test Data

Test data is available in:
- `API_TEST_DATA.json` - Complete test data for all endpoints
- Individual test files contain specific test cases

## ✅ Running Tests

### Registration API Tests
```bash
# HTTP file (VS Code)
# Open: tests/api/auth/register.http
# Click "Send Request" on each test

# Postman
# Import: tests/api/auth/register.postman.json

# Shell script
bash tests/api/auth/register.sh

# Jest
npm test -- tests/api/auth/register.test.ts
```

## 🐛 Troubleshooting

### Tests Fail with Connection Error
- Ensure server is running: `npm run dev`
- Check server is on `http://localhost:3000`
- Verify database connection

### Tests Fail with Validation Errors
- Check test data matches current schema
- Verify required fields are present
- Check field formats (email, phone, etc.)

### Duplicate Email Tests Fail
- Use unique emails (scripts use timestamps)
- Clear test data from database if needed

## 📊 Test Results

After running tests, you should see:
- ✅ Green checkmarks for passing tests
- ❌ Red X for failing tests
- Response data for each request
- Status codes and error messages

## 🔄 Updating Tests

When APIs change:
1. Update test data in test files
2. Update expected responses
3. Add new test cases for new features
4. Remove obsolete test cases

## 📚 Additional Resources

- [API Test Report](../API_TEST_REPORT.md) - Comprehensive test report
- [API Test Data](../API_TEST_DATA.json) - Complete test data
- [API Documentation](../API_DOCUMENTATION.md) - API documentation (if available)

