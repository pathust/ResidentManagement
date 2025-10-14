# Residence Management System

A comprehensive web application for managing residential communities, including household registration, fee collection, and fund management.

## 🏗️ Project Structure

```
ResidenceManagement/
├── backend/          # Spring Boot REST API
├── frontend/         # React.js application
├── db/              # Database schemas and migrations
└── docs/            # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Git**

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/[your-username]/ResidenceManagement.git
cd ResidenceManagement
```

2. **Set up the database**
```bash
# Login to MySQL
mysql -u root -p

# Run the schema script
source db/schema.sql
```

3. **Backend setup**
```bash
cd backend

# Copy environment file and configure
cp application.properties.template application.properties
# Edit application.properties with your database credentials

# Install dependencies and run
./mvnw spring-boot:run
```
The backend will start at `http://localhost:8080`

4. **Frontend setup**
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

```
The frontend will start at `http://localhost:3000`

## 👥 Team Development Guide

### Git Workflow

We use **Feature Branch Workflow** with the following branches:
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches

### Creating a new feature

1. **Update your local develop branch**
```bash
git checkout develop
git pull origin develop
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Work on your feature**
```bash
# Make changes
git add .
git commit -m "feat: add your feature description"
```

4. **Push your branch**
```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request**
- Go to GitHub
- Create PR from your feature branch to `develop`
- Assign reviewers
- Wait for approval and merge

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes

### Commit Message Convention

Format: `<type>: <description>`

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Test changes
- `chore` - Build process or auxiliary tool changes

Examples:
```bash
git commit -m "feat: add household registration API"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update API documentation"
```

## 📝 API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.
