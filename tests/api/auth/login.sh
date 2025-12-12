#!/bin/bash

# Login API Test Script
# POST /api/auth/login

BASE_URL="http://localhost:3000/api"
CONTENT_TYPE="Content-Type: application/json"

echo "=========================================="
echo "Login API Test Cases"
echo "=========================================="
echo ""
echo "Note: Make sure you have a registered user first!"
echo ""

# Test 1: Valid Login
echo "✅ Test 1: Valid Login"
echo "Enter email: "
read TEST_EMAIL
echo "Enter password: "
read -s TEST_PASSWORD

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ PASS: Status code is 200"
  echo "Response: $BODY" | jq .
else
  echo "❌ FAIL: Expected 200, got $HTTP_CODE"
  echo "Response: $BODY" | jq .
fi
echo ""

# Test 2: Wrong Password
echo "❌ Test 2: Wrong Password"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"WrongPassword123!\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 401 ]; then
  echo "✅ PASS: Status code is 401"
  echo "Response: $BODY" | jq .
else
  echo "❌ FAIL: Expected 401, got $HTTP_CODE"
  echo "Response: $BODY" | jq .
fi
echo ""

# Test 3: Nonexistent User
echo "❌ Test 3: Nonexistent User"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "nonexistent.user@example.com",
    "password": "SomePassword123!"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 401 ]; then
  echo "✅ PASS: Status code is 401"
  echo "Response: $BODY" | jq .
else
  echo "❌ FAIL: Expected 401, got $HTTP_CODE"
  echo "Response: $BODY" | jq .
fi
echo ""

# Test 4: Missing Email
echo "❌ Test 4: Missing Email"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "password": "SecurePass123!"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
  echo "✅ PASS: Status code is 400"
  echo "Response: $BODY" | jq .
else
  echo "❌ FAIL: Expected 400, got $HTTP_CODE"
  echo "Response: $BODY" | jq .
fi
echo ""

# Test 5: Missing Password
echo "❌ Test 5: Missing Password"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d "{
    \"email\": \"$TEST_EMAIL\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
  echo "✅ PASS: Status code is 400"
  echo "Response: $BODY" | jq .
else
  echo "❌ FAIL: Expected 400, got $HTTP_CODE"
  echo "Response: $BODY" | jq .
fi
echo ""

echo "=========================================="
echo "All tests completed!"
echo "=========================================="

