#!/bin/bash

# News Portal - Setup Script
# This script automates the backend and frontend setup process

set -e

echo "🚀 News Portal - Automated Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"
echo -e "${GREEN}✓ PostgreSQL installed${NC}"
echo ""

# Backend Setup
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
fi

echo "Installing backend dependencies..."
npm install --silent

echo "Creating database..."
createdb news_portal 2>/dev/null || echo -e "${YELLOW}⚠ Database might already exist${NC}"

echo "Running migrations..."
npm run db:migrate --silent

echo "Seeding database..."
npm run db:seed:all --silent

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend Setup
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd ../

echo "Installing frontend dependencies..."
npm install --silent

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Summary
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start Backend (Terminal 1):"
echo -e "   ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Open browser:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "Default Credentials:"
echo -e "   ${YELLOW}Email: admin@newportal.com${NC}"
echo -e "   ${YELLOW}Password: Admin@123456${NC}"
echo ""
echo "Documentation:"
echo -e "   ${YELLOW}QUICKSTART.md - Quick setup guide${NC}"
echo -e "   ${YELLOW}API_REFERENCE.md - API endpoints${NC}"
echo -e "   ${YELLOW}backend/ARCHITECTURE.md - Full architecture${NC}"
echo ""
