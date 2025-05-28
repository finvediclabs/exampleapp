# Blog Platform

A modern blogging platform built with React and Spring Boot.

## Project Structure
- `frontend/` - React TypeScript frontend application
- `backend/` - Spring Boot backend application

## Features
- User registration and authentication
- Create, edit, and delete blog posts
- Comment system
- Tags and categories
- Rich text editor
- Responsive design

## Prerequisites
- Node.js 16+
- Java 17+
- Maven 3.6+
- MySQL 8+

## Setup Instructions

### Frontend
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Backend
1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
./mvnw clean install
```

3. Run the application:
```bash
./mvnw spring-boot:run
```

## Environment Variables
Create a `.env` file in the frontend directory with:
```
REACT_APP_API_URL=http://localhost:8080/api
```

## Technologies Used
- Frontend:
  - React 18
  - TypeScript
  - Material-UI
  - Redux Toolkit
  - React Router
- Backend:
  - Spring Boot 3
  - Spring Security
  - Spring Data JPA
  - MySQL
  - Lombok 