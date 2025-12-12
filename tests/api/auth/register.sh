#!/bin/bash

# Registration API Test Script
# POST /api/auth/register
# 
# Usage: ./register.sh
# Make sure the server is running on http://localhost:3000

BASE_URL="http://localhost:3000/api"
CONTENT_TYPE="Content-Type: application/json"

echo "=========================================="
echo "Registration API Test Cases"
echo "=========================================="
echo ""

# Test 1: Valid Registration - Customer
echo "✅ Test 1: Valid Registration - Customer"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.'$(date +%s)'@example.com",
    "password": "SecurePass123!",
    "role": "customer",
    "phone": "+1-514-555-1234"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
  echo "✅ PASS: Status code is 201"
  echo "Response: $BODY" | jq .
else
  echo "❌ FAIL: Expected 201, got $HTTP_CODE"
  echo "Response: $BODY" | jq .
fi
echo ""

# Test 2: Valid Registration - Photographer
echo "✅ Test 2: Valid Registration - Photographer"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith.'$(date +%s)'@example.com",
    "password": "SecurePass123!",
    "role": "photographer",
    "phone": "+1-514-555-5678"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
  echo "✅ PASS: Status code is 201"
  echo "Response: $BODY" | jq .
else
  echo "❌ FAIL: Expected 201, got $HTTP_CODE"
  echo "Response: $BODY" | jq .
fi
echo ""

# Test 3: Missing Required Fields
echo "❌ Test 3: Missing Required Fields"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "test@example.com"
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

# Test 4: Invalid Email Format
echo "❌ Test 4: Invalid Email Format"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "invalid-email",
    "password": "SecurePass123!",
    "role": "customer"
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

# Test 5: Password Too Short
echo "❌ Test 5: Password Too Short"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test.'$(date +%s)'@example.com",
    "password": "123",
    "role": "customer"
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

# Test 6: Duplicate Email
echo "❌ Test 6: Duplicate Email"
DUPLICATE_EMAIL="duplicate.'$(date +%s)'@example.com"

# First registration
curl -s -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d "{
    \"firstName\": \"First\",
    \"lastName\": \"User\",
    \"email\": \"$DUPLICATE_EMAIL\",
    \"password\": \"SecurePass123!\",
    \"role\": \"customer\"
  }" > /dev/null

# Second registration with same email
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d "{
    \"firstName\": \"Second\",
    \"lastName\": \"User\",
    \"email\": \"$DUPLICATE_EMAIL\",
    \"password\": \"SecurePass123!\",
    \"role\": \"customer\"
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

