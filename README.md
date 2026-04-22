# ⚡ TaskFlow — Scalable REST API with Authentication & Role-Based Access

A production-ready **REST API** built with **FastAPI**, featuring **JWT authentication**, **role-based access control (RBAC)**, full **CRUD operations**, and a **Vanilla JS frontend** — all containerized with **Docker**.

---

## 📋 Table of Contents

- [Quick Start — Docker Hub](#-quick-start--docker-hub)
- [Local Development Setup](#-local-development-setup)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Security Practices](#-security-practices)
- [Scalability Notes](#-scalability-notes)
- [Docker Deployment](#-docker-deployment)

---

## 🐳 Quick Start — Docker Hub

The fastest way to run TaskFlow — no cloning, no setup, just pull and run.

### Prerequisites
- **Docker** installed and running ([Get Docker](https://docs.docker.com/get-docker/))

### 1. Pull the Images
```bash
docker pull archisman2006/taskflow-backend:latest
docker pull archisman2006/taskflow-frontend:latest
```

### 2. Run the Backend
```bash
docker run -d -p 8000:8000 --name taskflow-backend archisman2006/taskflow-backend:latest
```

### 3. Run the Frontend
```bash
docker run -d -p 3000:80 --name taskflow-frontend archisman2006/taskflow-frontend:latest
```

### 4. Access the Application
| Service            | URL                           |
|:-------------------|:------------------------------|
| **Frontend**       | http://localhost:3000          |
| **Backend API**    | http://localhost:8000          |
| **Swagger Docs**   | http://localhost:8000/docs     |
| **ReDoc**          | http://localhost:8000/redoc    |

### 5. Stop & Remove Containers
```bash
docker stop taskflow-backend taskflow-frontend
docker rm taskflow-backend taskflow-frontend
```

> 💡 **Tip**: To run in the foreground (see logs), remove the `-d` flag from the `docker run` commands.

---

## 🚀 Local Development Setup

If you want to modify the source code and run locally without Docker.

### Prerequisites
- **Python 3.10+** installed
- **pip** (Python package manager)
- **Git** (for version control)

### 1. Clone the Repository
```bash
git clone https://github.com/Archisman936/TaskFlow.git
cd TaskFlow
```

### 2. Set Up Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Edit `backend/.env` with your settings:
```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///./app.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> ⚠️ **Important**: Generate a strong SECRET_KEY for production:
> ```python
> python -c "import secrets; print(secrets.token_hex(32))"
> ```

### 5. Run the Backend Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 6. Open the Frontend
Open `frontend/index.html` in your browser, or access it via:
```
http://localhost:8000/app
```

### 7. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## ✨ Features

### Backend
- ✅ User **registration & login** with password hashing (bcrypt)
- ✅ **JWT token** authentication (stateless, scalable)
- ✅ **Role-based access control** (User vs Admin)
- ✅ Full **CRUD** for Tasks entity (Create, Read, Update, Delete)
- ✅ **API versioning** (`/api/v1/...`)
- ✅ **Input validation** with Pydantic schemas
- ✅ **Error handling** with proper HTTP status codes
- ✅ **Swagger/OpenAPI** auto-generated documentation
- ✅ **Pagination** support on list endpoints
- ✅ **Ownership enforcement** — users can only access their own tasks

### Frontend
- ✅ **Login & Register** forms with validation
- ✅ **Protected Dashboard** (requires JWT)
- ✅ **Task Management** — Create, Edit, Delete tasks via modal
- ✅ **Stats Dashboard** — Live task counters
- ✅ **Admin Panel** — User management table (admin only)
- ✅ **Toast Notifications** — Success/error feedback
- ✅ **Responsive Design** — Works on desktop and mobile
- ✅ **Dark Theme** with glassmorphism UI

### Security & Scalability
- ✅ Bcrypt password hashing (slow by design, brute-force resistant)
- ✅ JWT tokens with expiration
- ✅ CORS middleware configured
- ✅ Input sanitization (Pydantic + frontend HTML escaping)
- ✅ Docker containerization ready
- ✅ Modular project structure for easy scaling

---

## 🛠 Tech Stack

| Layer        | Technology                     |
|:-------------|:-------------------------------|
| **Backend**  | FastAPI (Python 3.10+)         |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **ORM**      | SQLAlchemy 2.0                 |
| **Auth**     | JWT (python-jose) + bcrypt (passlib) |
| **Validation** | Pydantic v2                  |
| **Frontend** | Vanilla HTML + CSS + JavaScript |
| **Server**   | Uvicorn (ASGI)                 |
| **Docs**     | Swagger UI (auto-generated)    |
| **Container**| Docker + Docker Compose        |

---

## 📁 Project Structure

```
Backend Development/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App package
│   │   ├── main.py              # FastAPI entry point, CORS, routing
│   │   ├── config.py            # Pydantic Settings (env vars)
│   │   ├── database.py          # SQLAlchemy engine & session
│   │   ├── dependencies.py      # Auth dependencies (JWT validation)
│   │   ├── models/
│   │   │   ├── user.py          # User SQLAlchemy model
│   │   │   └── task.py          # Task SQLAlchemy model
│   │   ├── schemas/
│   │   │   ├── user.py          # User Pydantic schemas
│   │   │   └── task.py          # Task Pydantic schemas
│   │   ├── routers/
│   │   │   ├── auth.py          # Auth routes (register, login, me)
│   │   │   ├── tasks.py         # Task CRUD routes
│   │   │   └── users.py         # Admin user management routes
│   │   └── services/
│   │       ├── auth_service.py  # JWT + bcrypt logic
│   │       └── task_service.py  # Task CRUD business logic
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   └── Dockerfile               # Backend container
├── frontend/
│   ├── Dockerfile               # Frontend container
│   ├── index.html               # Main HTML page
│   ├── css/
│   │   └── style.css            # Design system & styles
│   └── js/
│       ├── api.js               # API client (centralized HTTP)
│       ├── auth.js              # Login/Register UI logic
│       └── dashboard.js         # Tasks & Admin dashboard UI
├── docker-compose.yml           # Full stack orchestration
├── .gitignore                   # Git exclusions
└── README.md                    # This file
```

---

## 📖 API Documentation

FastAPI **automatically generates** interactive API documentation:

| Documentation | URL                          |
|:-------------|:-----------------------------|
| Swagger UI   | `http://localhost:8000/docs`  |
| ReDoc        | `http://localhost:8000/redoc` |
| OpenAPI JSON | `http://localhost:8000/openapi.json` |

Swagger UI includes a built-in **"Authorize"** button where you can enter your JWT token to test protected endpoints directly in the browser.

---

## 🔗 API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint          | Description              | Auth Required |
|:-------|:------------------|:-------------------------|:-------------|
| POST   | `/auth/register`  | Register new user        | ❌ No        |
| POST   | `/auth/login`     | Login, returns JWT token | ❌ No        |
| GET    | `/auth/me`        | Get current user profile | ✅ Yes       |

### Tasks (`/api/v1/tasks`)
| Method | Endpoint          | Description                    | Auth Required |
|:-------|:------------------|:-------------------------------|:-------------|
| GET    | `/tasks/`         | List tasks (own or all for admin) | ✅ Yes    |
| POST   | `/tasks/`         | Create a new task              | ✅ Yes       |
| GET    | `/tasks/{id}`     | Get a specific task            | ✅ Yes       |
| PUT    | `/tasks/{id}`     | Update a task                  | ✅ Yes       |
| DELETE | `/tasks/{id}`     | Delete a task                  | ✅ Yes       |

### Users — Admin Only (`/api/v1/users`)
| Method | Endpoint          | Description              | Auth Required |
|:-------|:------------------|:-------------------------|:-------------|
| GET    | `/users/`         | List all users           | ✅ Admin     |
| GET    | `/users/{id}`     | Get user details         | ✅ Admin     |
| PUT    | `/users/{id}`     | Update user (role, etc.) | ✅ Admin     |
| DELETE | `/users/{id}`     | Delete user + tasks      | ✅ Admin     |

### Health Check
| Method | Endpoint          | Description              | Auth Required |
|:-------|:------------------|:-------------------------|:-------------|
| GET    | `/`               | API health check         | ❌ No        |
| GET    | `/api/v1/health`  | Versioned health check   | ❌ No        |

---

## 🗄 Database Schema

### Users Table
| Column          | Type         | Constraints                |
|:----------------|:-------------|:--------------------------|
| id              | INTEGER      | PK, Auto-increment       |
| username        | VARCHAR(50)  | Unique, Not Null, Indexed |
| email           | VARCHAR(100) | Unique, Not Null, Indexed |
| hashed_password | VARCHAR(255) | Not Null                  |
| role            | VARCHAR(20)  | Default: "user"           |
| is_active       | BOOLEAN      | Default: True             |
| created_at      | DATETIME     | Auto-set on creation      |

### Tasks Table
| Column      | Type         | Constraints                     |
|:------------|:-------------|:-------------------------------|
| id          | INTEGER      | PK, Auto-increment             |
| title       | VARCHAR(200) | Not Null                       |
| description | TEXT         | Nullable                       |
| status      | VARCHAR(20)  | Default: "todo"                |
| priority    | VARCHAR(20)  | Default: "medium"              |
| owner_id    | INTEGER      | FK → users.id, Not Null        |
| created_at  | DATETIME     | Auto-set on creation           |
| updated_at  | DATETIME     | Auto-updated on modification   |

### Entity Relationship
```
┌──────────┐       1:N       ┌──────────┐
│  Users   │─────────────────│  Tasks   │
│──────────│                 │──────────│
│ id (PK)  │                 │ id (PK)  │
│ username │                 │ title    │
│ email    │                 │ status   │
│ password │                 │ priority │
│ role     │                 │ owner_id │◄── FK
│ is_active│                 │ created  │
│ created  │                 │ updated  │
└──────────┘                 └──────────┘
```

---

## 🔒 Security Practices

| Practice                | Implementation                                       |
|:------------------------|:----------------------------------------------------|
| **Password Hashing**    | bcrypt via passlib (intentionally slow, salt-per-hash)|
| **Token Auth**          | JWT with HS256 signing, configurable expiration      |
| **Input Validation**    | Pydantic schemas with type + length constraints      |
| **RBAC**                | Dependency chain: JWT → Active → Admin               |
| **IDOR Prevention**     | Ownership checks on all task operations              |
| **CORS**                | Configurable allowed origins                         |
| **XSS Prevention**      | Frontend HTML escaping on all rendered content       |
| **Secret Management**   | Environment variables via .env (never hardcoded)     |
| **Self-delete Guard**   | Admins cannot delete their own account               |

---

## 📈 Scalability Notes

This project is designed with horizontal scalability in mind:

### Current Architecture (Monolith)
Suitable for **1,000–10,000 users** with a single server.

### Scaling Path

1. **Database**: Swap SQLite → **PostgreSQL** by changing one env variable (`DATABASE_URL`). PostgreSQL handles concurrent connections far better.

2. **Caching**: Add **Redis** for:
   - JWT token blacklisting (logout invalidation)
   - Rate limiting
   - Session caching

3. **Load Balancing**: Run multiple **Uvicorn workers** behind **Nginx** or a cloud load balancer (AWS ALB, GCP Cloud Run).

4. **Microservices**: If the app grows, split into:
   - Auth Service (user management + JWT)
   - Task Service (CRUD operations)
   - Gateway (API routing + rate limiting)

5. **Containerization**: Docker + **Kubernetes** (K8s) for auto-scaling based on CPU/memory usage.

6. **CI/CD**: GitHub Actions pipeline for:
   - Automated testing on PR
   - Docker image build + push
   - Auto-deploy to staging/production

---

## 🐳 Docker Deployment

### Docker Hub Images
| Image | Pull Command |
|:------|:-------------|
| **Backend** | `docker pull archisman2006/taskflow-backend:latest` |
| **Frontend** | `docker pull archisman2006/taskflow-frontend:latest` |

### Using Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Run in detached (background) mode
docker-compose up -d

# Stop all services
docker-compose down
```

| Service | URL |
|:--------|:----|
| Backend API | http://localhost:8000 |
| Frontend | http://localhost:3000 |
| Swagger Docs | http://localhost:8000/docs |

### Using Docker (Individual Containers)
```bash
# Backend
cd backend
docker build -t taskflow-api .
docker run -d -p 8000:8000 taskflow-api

# Frontend
cd frontend
docker build -t taskflow-frontend .
docker run -d -p 3000:80 taskflow-frontend
```

---

## 📬 Testing with Swagger

1. Open http://localhost:8000/docs
2. Use **POST /api/v1/auth/register** to create a user
3. Use **POST /api/v1/auth/login** to get a JWT token
4. Click **"Authorize"** button → paste the token
5. Now test all protected endpoints!

---

## 👤 Author

Built as a **Backend Development Assignment** demonstrating:
- RESTful API design principles
- Authentication & authorization best practices
- Clean, modular code architecture
- Full-stack integration (API + Frontend)
- Deployment readiness (Docker)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
