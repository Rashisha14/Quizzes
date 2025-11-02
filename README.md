# <p align="center">QuizArrow</p>
## <p align="center">Quiz Platform</p>

<p align="center">
 <a href="#"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="#"><img src="https://img.shields.io/badge/JSON%20Web%20Tokens-black?style=for-the-badge&logo=JSON-Web-Tokens" alt="JWT"></a></p>

## Introduction

The Quiz Platform is a full-stack web application designed for creating, participating in, and managing online quizzes. It provides a platform where administrators can create and manage quizzes, while users can join, play, and compete in real time. The platform supports multiple categories and difficulty levels and offers real-time quiz participation, scoring, and result tracking.

## Table of Contents

1.  [Key Features](#key-features)
2.  [Installation Guide](#installation-guide)
3.  [Usage](#usage)
4.  [Environment Variables](#environment-variables)
5.  [Project Structure](#project-structure)
6.  [Technologies Used](#technologies-used)
7.  [License](#license)

## Key Features

*   **Admin Dashboard:** Secure admin interface for creating and managing quizzes with support for multiple categories and difficulty levels.
*   **Real-Time Quiz Participation:** Users can participate in quizzes in real-time, with immediate feedback and scoring.
*   **Leaderboard:** A dynamic leaderboard tracks user scores and completion times, fostering a competitive environment.
*   **User Authentication:** Secure user and admin authentication via JWT, ensuring only authorized users can access specific features.
*   **Quiz Search:** Users can search for specific quizzes using a unique quiz code.
*   **Landing Page with Animated Stats:** Landing page showcasing platform statistics with engaging animations.

## Installation Guide

Follow these steps to set up the Quiz Platform locally:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install backend dependencies:**

    ```bash
    cd Backend
    npm install
    ```

3.  **Configure Prisma:**

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

4.  **Run the backend server:**

    ```bash
    npm start
    ```

5.  **Install frontend dependencies:**

    ```bash
    cd ../QuizApp
    npm install
    ```

6.  **Run the frontend application:**

    ```bash
    npm run dev
    ```

7.  **Set up environment variables:**

    Create `.env` files in both the `Backend` and `QuizApp` directories. Refer to the [Environment Variables](#environment-variables) section for required variables.

## Usage

### Backend (Node.js/Express)

The backend provides API endpoints for user authentication, quiz management, and leaderboard retrieval. It uses Prisma as an ORM to interact with the database.

### Frontend (React)

The frontend provides user interfaces for:

*   User sign-up and sign-in.
*   Browsing available quizzes.
*   Taking quizzes and submitting answers.
*   Viewing the leaderboard for a specific quiz.
*   Admin sign-up and sign-in.
*   Admin quiz management.

## Environment Variables

The following environment variables are required for the Quiz Platform to function correctly:

**Backend (.env):**

*   `DATABASE_URL`: The connection string for the PostgreSQL database.
*   `JWT_SECRET`: A secret key used for signing JWT tokens.

**Frontend (.env):**

*   `VITE_BACKEND_URL`: The URL of the backend server (e.g., `http://localhost:3000`).

## Project Structure

```
.
├── Backend/                # Node.js backend application
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies and scripts
│   ├── prisma/             # Prisma ORM configuration
│   │   ├── schema.prisma   # Database schema definition
│   │   └── migrations/    # Database migrations
│   └── node_modules/       # Node modules
├── QuizApp/                # React frontend application
│   ├── src/                # React components and assets
│   │   ├── App.jsx         # Main application component
│   │   ├── components/     # Reusable React components
│   │   ├── assets/        # Assets folder
│   │   └── main.jsx        # Entry point for the React application
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies and scripts
│   ├── vite.config.js      # Vite build configuration
│   └── node_modules/       # Node modules
└── README.md               # Project documentation
```

## Technologies Used

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="#"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="#"><img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="#"><img src="https://img.shields.io/badge/JSON%20Web%20Tokens-black?style=for-the-badge&logo=JSON-Web-Tokens" alt="JWT"></a>
</p>

*   **Backend:** Node.js, Express.js
*   **Frontend:** React
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Authentication:** JWT
*   **Styling:** Tailwind CSS

## License

MIT License

<p align="center">
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License"></a>
</p>
