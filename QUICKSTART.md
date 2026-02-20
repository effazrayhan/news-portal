# Quick Start Guide - News Portal

## Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Setup (5 minutes)

### Step 1: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# Default: postgres/postgres

# Create database
createdb news_portal

# Run migrations and seed data
npm run db:migrate
npm run db:seed:all
```

### Step 2: Start Backend
```bash
npm run dev
# Backend runs at http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd ../  # Back to root
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

## ✅ Default Credentials

**Admin Account:**
- Email: `admin@newportal.com`
- Password: `Admin@123456`
- Role: Admin

**Editor Account:**
- Email: `editor1@newportal.com`
- Password: `Admin@123456`
- Role: Editor

## 📚 Available Categories
- Technology
- Business
- Health
- Sports
- Entertainment

## 🔗 API Testing

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@newportal.com",
    "password": "Admin@123456"
  }'
```

### 3. Get Articles
```bash
curl -X GET "http://localhost:5000/api/v1/articles?page=1&limit=10"
```

### 4. Create Article (with token)
```bash
curl -X POST http://localhost:5000/api/v1/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Article",
    "content": "This is a comprehensive article about technology and its impact...",
    "excerpt": "Summary of the article",
    "categoryId": "650e8400-e29b-41d4-a716-446655440000",
    "imageUrl": "https://example.com/image.jpg",
    "status": "published"
  }'
```

## 📁 Project Structure
```
news-portal/
├── backend/           # Node.js/Express API
│   ├── src/
│   ├── migrations/
│   ├── seeders/
│   └── package.json
├── src/               # React Frontend
│   ├── pages/
│   ├── components/
│   └── services/
└── package.json
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Verify database exists: `psql -l`

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Use `npm run dev -- --port 3000`

### Migration Issues
```bash
# Undo last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all
```

## 📖 Full Documentation
See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete documentation.

## 🎯 Next Steps
1. ✅ Backend & Frontend running
2. Login with admin credentials
3. Create first article
4. Explore API endpoints
5. Customize for your needs

---

Happy coding! 🎉
