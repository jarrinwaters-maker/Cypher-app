#!/bin/bash

# Connection Test Script for C705 Backend & S3
# This script tests all connections: Database, S3, and API endpoints

echo "🔍 Testing C705 Backend & S3 Connections"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "   Create .env file with:"
    echo "   - DATABASE_URL"
    echo "   - AWS_ACCESS_KEY_ID"
    echo "   - AWS_SECRET_ACCESS_KEY"
    echo "   - AWS_REGION"
    echo "   - AWS_S3_BUCKET_NAME"
    exit 1
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Test 1: Database Connection
echo ""
echo "📊 Test 1: Database Connection"
echo "-------------------------------"
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "   Check DATABASE_URL in .env"
fi

# Test 2: S3 Configuration
echo ""
echo "☁️  Test 2: S3 Configuration"
echo "-----------------------------"
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo -e "${RED}❌ AWS credentials not found in .env${NC}"
else
    echo -e "${GREEN}✅ AWS credentials found${NC}"
    echo "   Bucket: ${AWS_S3_BUCKET_NAME:-c705-media}"
    echo "   Region: ${AWS_REGION:-us-east-2}"
fi

# Test 3: Backend Server
echo ""
echo "🚀 Test 3: Backend Server"
echo "-------------------------"
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
    echo "   URL: http://localhost:3000"
    echo "   Network URL: http://10.0.0.215:3000"
else
    echo -e "${YELLOW}⚠️  Backend server not running${NC}"
    echo "   Start with: npm run start:dev"
fi

# Test 4: S3 Upload (requires server running)
echo ""
echo "📤 Test 4: S3 Upload Test"
echo "------------------------"
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Manual test required${NC}"
    echo "   Use Postman to test:"
    echo "   POST http://10.0.0.215:3000/s3/upload"
    echo "   Headers: Authorization: Bearer YOUR_TOKEN"
    echo "   Body: form-data with 'file' field"
else
    echo -e "${RED}❌ Cannot test - server not running${NC}"
fi

echo ""
echo "=========================================="
echo "✅ Connection tests complete!"
echo ""
echo "Next steps:"
echo "1. Start backend: npm run start:dev"
echo "2. Test S3 upload via Postman"
echo "3. Test iOS app connection"

