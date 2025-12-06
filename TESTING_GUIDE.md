# 🧪 Testing Guide - Model API Routes

## Prerequisites

1. **MongoDB Running**
   - Local MongoDB: Make sure MongoDB is running on your machine
   - MongoDB Atlas: Use your connection string in `.env.local`

2. **Environment Variables**
   - Create `.env.local` file in project root
   - Add: `MONGODB_URI=mongodb://localhost:27017/lumira`

3. **Dependencies Installed**
   - Run: `npm install` (already done ✅)

## Test Routes Available

### 1. User Model Test
**URL:** `http://localhost:3000/api/test-user`

**What it tests:**
- ✅ Database connection
- ✅ User model schema
- ✅ Model is properly exported
- ✅ Can query the database

**Expected Response:**
```json
{
  "success": true,
  "message": "User model is working! ✅",
  "userCount": 0,
  "schemaFields": ["_id", "name", "email", "password", ...],
  "note": "This confirms the User model is properly set up and connected to the database."
}
```

### 2. Photographer Model Test
**URL:** `http://localhost:3000/api/test-photographer`

**What it tests:**
- ✅ Database connection
- ✅ Photographer model schema
- ✅ Model is properly exported
- ✅ Can query the database

**Expected Response:**
```json
{
  "success": true,
  "message": "Photographer model is working! ✅",
  "photographerCount": 0,
  "schemaFields": ["_id", "user", "bio", "specialties", ...],
  "note": "This confirms the model is properly set up. Next step: Add more fields!"
}
```

## How to Test

### Option 1: Browser
1. Start dev server: `npm run dev`
2. Open browser
3. Visit: `http://localhost:3000/api/test-user`
4. You should see JSON response

### Option 2: Postman/Thunder Client
1. Start dev server: `npm run dev`
2. Open Postman or Thunder Client (VS Code extension)
3. Create GET request to: `http://localhost:3000/api/test-user`
4. Send request
5. Check response

### Option 3: curl (Terminal)
```bash
curl http://localhost:3000/api/test-user
```

## Troubleshooting

### Error: "MONGODB_URI environment variable not defined"
**Solution:** Create `.env.local` file with MongoDB connection string

### Error: "MongoServerError: connect ECONNREFUSED"
**Solution:** 
- Make sure MongoDB is running locally
- Or check your MongoDB Atlas connection string

### Error: "Cannot find module '@/lib/db/mongoose'"
**Solution:** 
- Make sure you're running `npm run dev` from project root
- Check that `lib/db/mongoose.ts` exists

### Port Already in Use
**Solution:**
- Kill existing process: `Get-Process -Name node | Stop-Process -Force`
- Or use different port: `npm run dev -- -p 3001`

## Success Indicators

✅ **Success:**
- Response status: 200
- `success: true` in JSON
- `userCount` or `photographerCount` shows 0 (no data yet)
- `schemaFields` array shows all model fields

❌ **Failure:**
- Response status: 500
- `success: false` in JSON
- Error message in response

## Next Steps After Testing

Once both test routes work:
1. ✅ Models are properly set up
2. ✅ Database connection works
3. ✅ Ready to continue with Photographer Model Step 2

