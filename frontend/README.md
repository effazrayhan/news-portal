# 📰 News Portal - Full-Stack Application

A production-ready news portal with Node.js/Express backend and React frontend. Features JWT authentication, role-based access control, article management, and comment moderation.

## ✨ Features

### 🔐 Security
- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control (Admin, Editor, User)
- Secure environment variable configuration
- CORS protection
- Security headers with Helmet

### 📰 Article Management
- Create, read, update, delete articles
- Article categorization
- Search and filtering by category
- Draft and published states
- Image URL support
- View count tracking

### 👥 User Management
- User registration and login
- Profile management
- Three user roles with different permissions
- Active/inactive user status

### 💬 Comments
- Comment creation and moderation
- Approval workflow
- Comment deletion
- Threaded under articles

## 🏗️ Tech Stack

### Backend
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 12+
- **ORM**: Sequelize 6.35
- **Authentication**: JWT + bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React 18+
- **Bundler**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Backend Setup (5 minutes)

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Create database
createdb news_portal

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed:all

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd ../
npm install
npm run dev
```

## 🔑 Default Credentials

**Admin Account**
- Email: `admin@newportal.com`
- Password: `Admin@123456`

**Editor Account**
- Email: `editor1@newportal.com`
- Password: `Admin@123456`

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete API endpoints
- **[backend/ARCHITECTURE.md](backend/ARCHITECTURE.md)** - Detailed architecture
- **[ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md)** - System diagrams
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built
