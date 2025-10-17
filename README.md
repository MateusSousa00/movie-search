# Movie Search + Favorites Application

A full-stack application for searching movies and managing favorites, built with **Next.js 15 (App Router)** for the frontend and **NestJS (Hexagonal Architecture)** for the backend.

## Key Features

- **Movie Search**: Search for movies using the OMDb API with real-time results.
- **Favorites Management**: Add and remove movies from your favorites collection.
- **Mobile-Friendly**: Fully responsive design using Tailwind CSS.
- **Clean Architecture**: Backend uses Hexagonal Architecture (Ports & Adapters) for maintainability and testability.
- **Type Safety**: Full TypeScript implementation across the entire stack.
- **Testing**: Comprehensive Jest unit tests for critical business logic.

---

## Tech Stack Summary

| Layer | Technology | Key Highlight |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, React 19, TanStack Query v5 | Server State Management, App Router |
| **Backend** | NestJS 10, TypeScript, Jest | Hexagonal Architecture, Dependency Injection |
| **Infrastructure** | Docker, Docker Compose, Node.js 20 | Containerization for easy setup |

---

## Project Structure Overview

The project is split into two main services:

```
. 
├── movie-search-api/ # NestJS backend 
├── movie-search-app/ # Next.js frontend 
├── docker-compose.yml # Orchestration 
└── README.md # This file
```

---

## Setup Instructions (Recommended)

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- OMDb API Key (Required for movie data)

### Steps

1.  **Clone and Configure:**
    ```bash
    cd movie-search-api
    cp .env.example .env
    # Edit .env and add your OMDb API key
    cd ../movie-search-app
    cp .env.example .env.local
    cd ..
    ```

2.  **Start the Application:**
    ```bash
    docker-compose up --build
    ```

3.  **Access:**
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:3001`

---

## Production Readiness

This project demonstrates production-ready patterns but currently uses in-memory storage.

The next steps for production are:
1.  Configure Sentry.
2.  Choose and configure a database (PostgreSQL recommended).
3.  Add Redis for caching.
4.  Set up CI/CD pipeline.