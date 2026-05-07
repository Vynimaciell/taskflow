# 🗂️ TaskFlow — Kanban Task Manager

Um gerenciador de tarefas estilo Kanban completo e profissional, com login, múltiplos projetos, dashboard com gráficos, tema claro/escuro e notificações de prazo.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Electron](https://img.shields.io/badge/Electron-31-47848F?logo=electron)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue)

---

### 🌐 [Acessar online → taskflow-sepia-phi.vercel.app](https://taskflow-sepia-phi.vercel.app)

### 💾 [Baixar instalador Windows (.exe)](https://github.com/Vynimaciell/taskflow/releases)

---

## ✨ Funcionalidades

- **Quadro Kanban** — Arraste tarefas entre Pendência → Em andamento → Revisão → Feito
- **Login e Cadastro** — Cada usuário tem sua conta com avatar personalizado
- **Modo Demo** — Visitante explora projetos de exemplo sem precisar criar conta
- **Múltiplos Projetos** — Crie projetos com nome, ícone e cor personalizada
- **Dashboard** — Gráficos de progresso por status, prioridade, tags e anel de conclusão
- **Prazos e Notificações** — Defina deadline nas tarefas e receba alertas de vencimento
- **Tema Claro/Escuro** — Alterne com um clique no botão ☀️/🌙
- **Filtros e Busca** — Filtre por prioridade, tag ou pesquise por texto
- **Sidebar com Projetos** — Menu lateral listando todos os seus projetos
- **App Desktop** — Disponível como instalador .exe para Windows via Electron

---

## 🚀 Como usar

Você tem 3 formas de usar o TaskFlow:

### Opção 1 — Pelo navegador (mais fácil)

Acesse: **https://taskflow-sepia-phi.vercel.app**

Não precisa instalar nada. Funciona em qualquer navegador.

### Opção 2 — Instalador Windows (.exe)

Baixe o arquivo `TaskFlow Setup 1.0.0.exe` na aba [Releases](https://github.com/Vynimaciell/taskflow/releases), execute e pronto. Não precisa de Node.js nem terminal.

### Opção 3 — Rodar pelo código fonte

**Pré-requisito:** Node.js 18+ instalado → [nodejs.org](https://nodejs.org)

```bash
git clone https://github.com/Vynimaciell/taskflow.git
cd taskflow/frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## 🏗️ Arquitetura

```
┌──────────────┐     HTTP/JSON     ┌──────────────────┐     JPA      ┌─────────┐
│  React SPA   │ ◄──────────────► │  Spring Boot API  │ ◄──────────► │  MySQL  │
│  (Vite)      │                  │  (Port 8080)      │              │  (3306) │
└──────────────┘                  └──────────────────┘              └─────────┘
     :5173                         Security + JWT

┌──────────────┐
│  Electron    │ ← App desktop (.exe) empacotando o frontend
└──────────────┘
```

---

## 📡 API Endpoints (Backend)

| Método   | Endpoint              | Descrição            | Auth     |
|----------|-----------------------|----------------------|----------|
| `POST`   | `/api/auth/register`  | Cadastrar usuário    | Não      |
| `POST`   | `/api/auth/login`     | Login e obter JWT    | Não      |
| `GET`    | `/api/tasks`          | Listar tarefas       | Sim      |
| `GET`    | `/api/tasks/{id}`     | Buscar tarefa por ID | Sim      |
| `POST`   | `/api/tasks`          | Criar tarefa         | Sim      |
| `PUT`    | `/api/tasks/{id}`     | Atualizar tarefa     | Sim      |
| `PATCH`  | `/api/tasks/{id}/move`| Mover tarefa         | Sim      |
| `DELETE` | `/api/tasks/{id}`     | Excluir tarefa       | Sim      |
| `GET`    | `/api/tasks/stats`    | Estatísticas         | Sim      |

---

## 📂 Estrutura do Projeto

```
taskflow/
├── backend/                    # API Spring Boot
│   ├── src/main/java/com/taskflow/
│   │   ├── config/             # Security, JWT, CORS
│   │   ├── controller/         # REST Controllers
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA Entities
│   │   ├── enums/              # TaskStatus, TaskPriority
│   │   ├── exception/          # Global Error Handler
│   │   ├── repository/         # Spring Data JPA
│   │   └── service/            # Business Logic
│   ├── src/test/               # Testes unitários (JUnit 5 + Mockito)
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React + Vite
│   └── src/
│       └── App.jsx             # Aplicação completa
├── electron/                   # App desktop
│   ├── main.js                 # Processo principal do Electron
│   └── package.json            # Config do electron-builder
├── database/
│   └── init.sql                # Schema MySQL
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

| Camada      | Tecnologias                                                    |
|-------------|----------------------------------------------------------------|
| **Frontend**  | React 18, Vite, CSS-in-JS, DM Sans, JetBrains Mono          |
| **Backend**   | Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA   |
| **Auth**      | JWT (jjwt), BCrypt                                           |
| **Database**  | MySQL 8.0, H2 (dev)                                         |
| **Desktop**   | Electron 31, electron-builder                                |
| **Deploy**    | Vercel (frontend), Docker (backend)                          |
| **Testes**    | JUnit 5, Mockito                                             |
| **Docs**      | Springdoc OpenAPI (Swagger UI)                               |

---

## 🐳 Rodando com Docker (backend + MySQL)

```bash
docker compose up -d
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

---

## 🖥️ Gerando o instalador .exe

```bash
cd frontend
npm run build

cd ../electron
npm install
xcopy ..\frontend\dist dist\ /E /I /Y
npm run build
```

O instalador estará em `electron/release/TaskFlow Setup 1.0.0.exe`

---

## 📜 Licença

MIT — use à vontade!

---

Feito por [Vynimaciell](https://github.com/Vynimaciell)
