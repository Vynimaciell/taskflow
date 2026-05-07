# 🗂️ TaskFlow — Kanban Task Manager

A full-stack Kanban board application built with **Spring Boot**, **React**, and **MySQL**.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- **Kanban Board** — Drag-and-drop tasks across TODO → In Progress → Review → Done
- **JWT Authentication** — Secure register/login with token-based auth
- **Task Management** — Full CRUD with priorities, tags, and ordering
- **Filtering & Search** — Filter by status, priority, or tag; full-text search
- **REST API** — Well-documented endpoints with Swagger/OpenAPI
- **Responsive UI** — Clean dark theme with smooth animations

---

## 🏗️ Architecture

```
┌──────────────┐     HTTP/JSON     ┌──────────────────┐     JPA      ┌─────────┐
│  React SPA   │ ◄──────────────► │  Spring Boot API  │ ◄──────────► │  MySQL  │
│  (Vite)      │                  │  (Port 8080)      │              │  (3306) │
└──────────────┘                  └──────────────────┘              └─────────┘
     :3000                         Security + JWT
```

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+ (or use Docker)

### Option 1: Docker (recommended)

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
docker compose up -d
```
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
# Configure MySQL in application.properties
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method   | Endpoint              | Description          | Auth     |
|----------|-----------------------|----------------------|----------|
| `POST`   | `/api/auth/register`  | Register new user    | No       |
| `POST`   | `/api/auth/login`     | Login & get JWT      | No       |
| `GET`    | `/api/tasks`          | List all tasks       | Required |
| `GET`    | `/api/tasks/{id}`     | Get task by ID       | Required |
| `POST`   | `/api/tasks`          | Create task          | Required |
| `PUT`    | `/api/tasks/{id}`     | Update task          | Required |
| `PATCH`  | `/api/tasks/{id}/move`| Move task (status)   | Required |
| `DELETE` | `/api/tasks/{id}`     | Delete task          | Required |
| `GET`    | `/api/tasks/stats`    | Dashboard stats      | Required |

### Example: Create Task
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement drag and drop",
    "description": "Use react-dnd for column reordering",
    "status": "TODO",
    "priority": "HIGH",
    "tags": ["Frontend", "Feature"]
  }'
```

---

## 🗄️ Database Schema

```sql
users (id, username, email, password, created_at)
tasks (id, title, description, status, priority, display_order, user_id, created_at, updated_at)
task_tags (task_id, tag)
```

---

## 🧪 Testing

```bash
cd backend
mvn test
```

---

## 📂 Project Structure

```
taskflow/
├── backend/
│   ├── src/main/java/com/taskflow/
│   │   ├── config/          # Security, JWT, CORS
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Request/Response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── enums/           # TaskStatus, TaskPriority
│   │   ├── exception/       # Global error handling
│   │   ├── repository/      # Spring Data JPA repos
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-dev.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                # React + Vite
├── database/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

**Backend:** Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA, JWT (jjwt), Lombok, MapStruct, Springdoc OpenAPI

**Frontend:** React 18, Vite, Tailwind CSS

**Database:** MySQL 8.0, H2 (dev)

**DevOps:** Docker, Docker Compose, GitHub Actions

---

## 📜 License

MIT — feel free to use this project in your portfolio!
