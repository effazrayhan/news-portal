# 📰 News Portal - Full-Stack Architecture Documentation

## 🏗️ Project Overview

A production-grade News Portal application built with:
- **Backend**: Node.js/Express + Sequelize ORM + PostgreSQL
- **Frontend**: React + Vite + Axios
- **Security**: JWT Authentication + Role-Based Access Control
- **Validation**: Joi schemas + Express validators

---

## 📁 Backend Architecture

### Folder Structure
```
backend/
├── src/
│   ├── config/              # Database and app configuration
│   │   ├── database.js      # Sequelize configuration
│   │   └── sequelize.js     # Sequelize instance
│   ├── models/              # Data models with associations
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Article.js
│   │   ├── Comment.js
│   │   └── index.js         # Model associations
│   ├── controllers/         # Request handlers
│   │   ├── AuthController.js
│   │   ├── ArticleController.js
│   │   ├── CategoryController.js
│   │   └── CommentController.js
│   ├── services/            # Business logic layer
│   │   ├── AuthService.js
│   │   ├── ArticleService.js
│   │   ├── CategoryService.js
│   │   └── CommentService.js
│   ├── routes/              # API endpoint definitions
│   │   ├── authRoutes.js
│   │   ├── articleRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── commentRoutes.js
│   │   └── index.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT verification & authorization
│   │   ├── errorHandler.js  # Global error handling
│   │   └── validateRequest.js # Joi validation
│   ├── validators/          # Request validation schemas
│   │   ├── authValidator.js
│   │   ├── articleValidator.js
│   │   ├── categoryValidator.js
│   │   └── commentValidator.js
│   ├── utils/               # Utility functions
│   │   ├── jwt.js           # JWT token operations
│   │   ├── password.js      # Password hashing/comparison
│   │   └── helpers.js       # General utilities
│   └── server.js            # Express app configuration
├── migrations/              # Database schema migrations
├── seeders/                 # Database seed data
├── .env                     # Environment variables (local)
├── .env.example             # Environment template
├── .sequelizerc             # Sequelize CLI configuration
└── package.json
```

### Separation of Concerns

| Layer | Responsibility |
|-------|-----------------|
| **Controllers** | Handle HTTP requests/responses, input validation |
| **Services** | Business logic, database operations, error handling |
| **Models** | Data schema, relationships, validations |
| **Routes** | Endpoint definitions, middleware stacking |
| **Middleware** | Cross-cutting concerns (auth, logging, error handling) |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role ENUM('admin', 'editor', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Articles Table
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  image_url VARCHAR(500),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
```

### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_article ON comments(article_id);
```

### Model Associations
```
User (1) ──── hasMany ──── Article (M)
User (1) ──── hasMany ──── Comment (M)
Category (1) ──── hasMany ──── Article (M)
Article (1) ──── hasMany ──── Comment (M)
```

---

## 🔐 Authentication & Security

### JWT Implementation

**Token Structure:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "editor",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Authentication Flow:**
1. User registers/logs in
2. Backend generates JWT token
3. Frontend stores token in localStorage
4. Each request includes token in `Authorization: Bearer <token>` header
5. Middleware verifies token and extracts user info

### Middleware Chain

```javascript
// Public endpoint
GET /api/v1/articles

// Protected endpoint (Authentication required)
POST /api/v1/articles
  ├── authenticate     // Verify JWT token
  ├── authorize(['editor', 'admin']) // Check role
  ├── validateRequest  // Validate input
  └── createArticle    // Handle request

// Admin-only endpoint
PUT /api/v1/categories/:id
  ├── authenticate
  ├── authorize(['admin'])
  ├── validateRequest
  └── updateCategory
```

### Password Security
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Compared using constant-time function

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

### 🔒 Authentication Endpoints

```
POST   /auth/register          Register new user
POST   /auth/login             Login user
GET    /auth/me               Get current user profile (Protected)
PUT    /auth/profile          Update user profile (Protected)
```

**Register Example:**
```json
POST /auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGci..."
  }
}
```

---

### 📰 Article Endpoints

```
GET    /articles               Get all published articles (Public)
GET    /articles/:id           Get article by ID (Public)
POST   /articles               Create article (Protected: Editor/Admin)
PUT    /articles/:id           Update article (Protected: Author/Admin)
DELETE /articles/:id           Delete article (Protected: Author/Admin)
GET    /articles/author/:id    Get articles by author (Public)
```

**Query Parameters (GET /articles):**
```
?page=1              Page number (default: 1)
&limit=10            Items per page (default: 10)
&categoryId=uuid     Filter by category
&search=term         Search in title/content
&status=published    Filter by status (published/draft/archived)
```

---

### 📂 Category Endpoints

```
GET    /categories             Get all categories (Public)
GET    /categories/:id         Get category with articles (Public)
POST   /categories             Create category (Protected: Admin)
PUT    /categories/:id         Update category (Protected: Admin)
DELETE /categories/:id         Delete category (Protected: Admin)
```

---

### 💬 Comment Endpoints

```
GET    /comments/article/:articleId    Get article comments (Public)
POST   /comments/article/:articleId    Create comment (Protected)
PUT    /comments/:commentId            Update comment (Protected: Author/Admin)
DELETE /comments/:commentId            Delete comment (Protected: Author/Admin)
POST   /comments/:commentId/approve    Approve comment (Protected: Admin)
GET    /comments/pending/all           Get pending comments (Protected: Admin)
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create Database**
   ```bash
   createdb news_portal
   ```

4. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

5. **Seed Initial Data**
   ```bash
   npm run db:seed:all
   ```
   
   Default credentials:
   - Admin: admin@newportal.com / Admin@123456
   - Editor: editor1@newportal.com / Admin@123456

6. **Start Server**
   ```bash
   npm run dev     # Development (with hot-reload)
   npm start       # Production
   ```

   Server runs at: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../  # Go back to root
   npm install
   ```

2. **Update API endpoint if needed**
   - Edit `src/services/api.js` if backend URL differs

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend runs at: `http://localhost:5173`

---

## 🔗 Useful Commands

### Database Operations
```bash
npm run db:migrate          # Run all pending migrations
npm run db:migrate:undo     # Undo last migration
npm run db:seed:all         # Run all seeders
npm run db:seed:undo        # Undo all seeders
```

### Server Operations
```bash
npm run dev                 # Start in development mode
npm start                   # Start in production mode
```

---

## ✅ Request Validation

### Joi Schemas

**User Registration:**
```javascript
{
  username: string(3-100, alphanumeric) [required],
  email: string(email) [required],
  password: string(8+) [required],
  firstName: string(max 100) [optional],
  lastName: string(max 100) [optional]
}
```

**Create Article:**
```javascript
{
  title: string(5-200) [required],
  content: string(50-50000) [required],
  excerpt: string(max 500) [optional],
  imageUrl: string(URI) [optional],
  categoryId: UUID [required],
  status: enum('draft', 'published', 'archived') [default: 'draft']
}
```

**Create Comment:**
```javascript
{
  content: string(1-5000) [required]
}
```

---

## 🛡️ Error Handling

### Response Format

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access - CRUD all resources, approve comments, manage users |
| **Editor** | Create/edit own articles, view all articles, comment on articles |
| **User** | Read articles, create/edit own comments, view profile |

---

## 📝 Code Examples

### Frontend - Login
```javascript
import { authAPI } from '@/services/api';

const login = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('authToken', response.data.token);
    // Redirect to dashboard
  } catch (error) {
    console.error(error);
  }
};
```

### Frontend - Create Article
```javascript
import { articleAPI } from '@/services/api';

const createArticle = async (articleData) => {
  try {
    const response = await articleAPI.create({
      title: 'Breaking News',
      content: 'Full article content...',
      categoryId: 'category-uuid',
      status: 'published'
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

### Frontend - Fetch Articles
```javascript
import { articleAPI } from '@/services/api';

const fetchArticles = async () => {
  try {
    const response = await articleAPI.getAll({
      page: 1,
      limit: 10,
      categoryId: 'tech-uuid',
      search: 'AI'
    });
    console.log(response.data.articles);
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🔍 Debugging & Monitoring

### Environment Variables
- `NODE_ENV` - Set to 'development' for verbose logging
- `JWT_SECRET` - Change in production
- `JWT_EXPIRY` - Token expiration time
- `FRONTEND_URL` - CORS allowed origin

### Logging
- Morgan logger for HTTP requests
- Console logs for errors (production should use proper logging service)

### Health Check
```bash
curl http://localhost:5000/health
```

---

## 🚢 Production Deployment

### Pre-deployment Checklist
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Set up HTTPS/SSL
- [ ] Configure database backups
- [ ] Set up monitoring and logging

### Database Migration in Production
```bash
npm run db:migrate -- --env production
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM Documentation](https://sequelize.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Security Guidelines](https://owasp.org/)

---

## 📞 Support & Contributions

For issues or feature requests, please open an issue in the repository.

---

**Last Updated:** February 2026
**Version:** 1.0.0
