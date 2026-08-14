#!/bin/bash

# Apple Sign In Backend Test Script
# This script tests the Apple Sign In endpoint

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Testing Apple Sign In Endpoint"
echo "=================================="
echo ""

# Test 1: Health Check
echo "1. Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is not responding (Status: $HEALTH_RESPONSE)"
    echo "   Make sure backend is running: cd c705-backend && npm run start:dev"
    exit 1
fi
echo ""

# Test 2: Apple Sign In with Email
echo "2. Testing Apple Sign In with Email..."
APPLE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/oauth/apple" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "apple",
    "identityToken": "eyJraWQiOiJlWGF1bm1ZT1dZR0JZIiwiYWxnIjoiUlMyNTYifQ.test",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "ARTIST"
  }')

HTTP_CODE=$(echo "$APPLE_RESPONSE" | grep -o '"statusCode":[0-9]*' | grep -o '[0-9]*' || echo "200")
if [ -z "$HTTP_CODE" ] || [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo "   ✅ Endpoint is accessible"
    echo "   Response: $(echo "$APPLE_RESPONSE" | head -c 200)"
else
    echo "   ❌ Endpoint returned error (Code: $HTTP_CODE)"
    echo "   Response: $APPLE_RESPONSE"
fi
echo ""

# Test 3: Apple Sign In without Email
echo "3. Testing Apple Sign In without Email..."
APPLE_NO_EMAIL=$(curl -s -X POST "$BASE_URL/auth/oauth/apple" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "apple",
    "identityToken": "eyJraWQiOiJlWGF1bm1ZT1dZR0JZIiwiYWxnIjoiUlMyNTYifQ.test2",
    "role": "ARTIST"
  }')

HTTP_CODE2=$(echo "$APPLE_NO_EMAIL" | grep -o '"statusCode":[0-9]*' | grep -o '[0-9]*' || echo "200")
if [ -z "$HTTP_CODE2" ] || [ "$HTTP_CODE2" = "200" ] || [ "$HTTP_CODE2" = "201" ]; then
    echo "   ✅ Endpoint handles missing email"
    echo "   Response: $(echo "$APPLE_NO_EMAIL" | head -c 200)"
else
    echo "   ❌ Endpoint error with missing email (Code: $HTTP_CODE2)"
    echo "   Response: $APPLE_NO_EMAIL"
fi
echo ""

# Test 4: Invalid Provider
echo "4. Testing Invalid Provider..."
INVALID_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/oauth/apple" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "invalid",
    "identityToken": "test",
    "role": "ARTIST"
  }')

if echo "$INVALID_RESPONSE" | grep -q "Invalid OAuth provider"; then
    echo "   ✅ Validation is working"
else
    echo "   ⚠️  Validation might not be working"
    echo "   Response: $INVALID_RESPONSE"
fi
echo ""

echo "=================================="
echo "✅ Testing Complete"
echo ""
echo "If all tests pass, the backend is configured correctly."
echo "Check iOS app configuration and network connectivity."

