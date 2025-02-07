# Epic Chat Interface Documentation

## 1. Setup Instructions

### Prerequisites
- Docker & Docker Compose installed
- Node.js and npm installed (if running locally without Docker)
- AWS credentials (for production deployment)

### Local Development Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Aaryan-Dev/epic-chat-interface
   cd epic-chat-interface
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

### Docker Setup
1. Build and start the services:
   ```sh
   docker-compose up --build
   ```
2. Access the application at `http://localhost:3000`


## 2. Architecture Overview
- **Frontend**: React.js (Served via Nginx in production)
- **Backend**: Node.js with Express.js
- **Containerization**: Docker for development and production

## 3. Implementation Decisions
- **React for UI**: Chosen for its flexibility and component-based design.
- **Node.js for Backend**: Allows seamless integration with frontend and real-time capabilities.
- **Dockerization**: Ensures consistency between local and production environments.

## 4. Testing Approach
- **Unit Testing**: Jest for frontend & backend components.

---
This documentation provides a comprehensive guide to setting up, understanding, and maintaining the Epic Chat Interface.

