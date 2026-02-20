# News Portal - Complete API Reference

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔒 Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

---

### Get Current User Profile
```http
GET /auth/me
Authorization: Bearer <token>
```

---

### Update User Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith"
}
```

---

## 📰 Article Endpoints

### Get All Articles
```http
GET /articles?page=1&limit=10&categoryId=uuid&search=term&status=published
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10) |
| categoryId | UUID | No | Filter by category |
| search | string | No | Search in title/content/excerpt |
| status | string | No | Filter by status (published/draft/archived) |

**Response:**
```json
{
  "success": true,
  "message": "Articles retrieved successfully",
  "data": {
    "articles": [
      {
        "id": "uuid",
        "title": "Breaking News",
        "slug": "breaking-news",
        "excerpt": "Summary...",
        "imageUrl": "https://...",
        "status": "published",
        "viewCount": 150,
        "author": {
          "id": "uuid",
          "username": "editor1",
          "email": "editor1@example.com"
        },
        "category": {
          "id": "uuid",
          "name": "Technology",
          "slug": "technology"
        },
        "createdAt": "2024-02-20T10:00:00Z",
        "publishedAt": "2024-02-20T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### Get Article By ID
```http
GET /articles/{id}
```

**Response:** Single article object

---

### Create Article
```http
POST /articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Breaking Tech News",
  "content": "Detailed content here... (minimum 50 characters)",
  "excerpt": "Brief summary (optional)",
  "imageUrl": "https://example.com/image.jpg",
  "categoryId": "650e8400-e29b-41d4-a716-446655440000",
  "status": "published"
}
```

**Required Role:** editor, admin

---

### Update Article
```http
PUT /articles/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published"
}
```

**Required Role:** Article author or admin

---

### Delete Article
```http
DELETE /articles/{id}
Authorization: Bearer <token>
```

**Required Role:** Article author or admin

---

### Get Articles By Author
```http
GET /articles/author/{authorId}?page=1&limit=10
```

---

## 📂 Category Endpoints

### Get All Categories
```http
GET /categories?page=1&limit=10&includeInactive=false
```

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "650e8400-e29b-41d4-a716-446655440000",
        "name": "Technology",
        "slug": "technology",
        "description": "Latest tech news",
        "isActive": true,
        "createdAt": "2024-02-20T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### Get Category By ID
```http
GET /categories/{id}
```

Returns category with its published articles

---

### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sports",
  "description": "Sports news and updates"
}
```

**Required Role:** admin

---

### Update Category
```http
PUT /categories/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sports & Gaming",
  "description": "Sports and gaming news",
  "isActive": true
}
```

**Required Role:** admin

---

### Delete Category
```http
DELETE /categories/{id}
Authorization: Bearer <token>
```

**Required Role:** admin
**Note:** Cannot delete category with articles

---

## 💬 Comment Endpoints

### Get Article Comments
```http
GET /comments/article/{articleId}?page=1&limit=10
```

Returns only approved comments

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "content": "Great article!",
        "isApproved": true,
        "author": {
          "id": "uuid",
          "username": "user1",
          "email": "user1@example.com"
        },
        "createdAt": "2024-02-20T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### Create Comment
```http
POST /comments/article/{articleId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a great article!"
}
```

**Required Role:** Authenticated user
**Note:** Comments require admin approval before appearing

---

### Update Comment
```http
PUT /comments/{commentId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment text"
}
```

**Required Role:** Comment author or admin

---

### Delete Comment
```http
DELETE /comments/{commentId}
Authorization: Bearer <token>
```

**Required Role:** Comment author or admin

---

### Approve Comment
```http
POST /comments/{commentId}/approve
Authorization: Bearer <token>
```

**Required Role:** admin

---

### Get Pending Comments
```http
GET /comments/pending/all?page=1&limit=10
Authorization: Bearer <token>
```

**Required Role:** admin

---

## Error Response Format

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

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |

---

## Rate Limiting
Currently no rate limiting. Consider adding for production.

## Pagination
All list endpoints support pagination with:
- `page` (default: 1)
- `limit` (default: 10)

## Sorting
Results are sorted by:
- Articles: `publishedAt DESC`
- Comments: `createdAt DESC`
- Categories: `name ASC`

---

**Last Updated:** February 2026
