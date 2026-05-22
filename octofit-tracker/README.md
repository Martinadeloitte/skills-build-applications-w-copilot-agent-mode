# OctoFit Tracker

A multi-tier fitness tracking application for Mergington High School students.

## 🏗️ Architecture

- **Presentation Tier**: React 19 with Vite
- **Logic Tier**: Node.js + Express + TypeScript
- **Data Tier**: MongoDB with Mongoose

## 🚀 Features

- User authentication and profiles
- Activity logging and tracking (running, walking, cycling, swimming, strength, yoga)
- Team creation and management
- Competitive leaderboards (individual and team)
- Points system based on activity type and duration
- Personalized workout suggestions

## 📋 Prerequisites

- Node.js (LTS version)
- MongoDB (mongodb-org package)
- npm or yarn

## 🛠️ Setup Instructions

### 1. MongoDB Setup

```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running, start MongoDB
# (Instructions vary by OS - consult MongoDB documentation)
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd octofit-tracker/backend

# Install dependencies
npm install

# Create .env file (already created from .env.example)
# Update MONGODB_URI if needed

# Run in development mode
npm run dev

# Backend will run on http://localhost:8000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd octofit-tracker/frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Frontend will run on http://localhost:5173
```

## 📁 Project Structure

```
octofit-tracker/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Activity.ts
│   │   │   └── Team.ts
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   ├── activities.ts
│   │   │   └── teams.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── Activities.jsx
    │   │   ├── Leaderboard.jsx
    │   │   └── Teams.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## 🎯 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/leaderboard/top` - Get top users

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/user/:userId` - Get activities by user
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:userId` - Remove member from team
- `DELETE /api/teams/:id` - Delete team
- `GET /api/teams/leaderboard/top` - Get top teams

## 🎮 Usage

1. Access the application at `http://localhost:5173`
2. Create users through the API or directly in MongoDB
3. Log activities through the Activities page
4. Create teams and add members
5. View rankings on the Leaderboard page
6. Track progress on the Dashboard

## 🏆 Points System

Activity points are calculated based on type and duration:
- Running: 10 points/minute
- Swimming: 12 points/minute
- Strength: 9 points/minute
- Cycling: 8 points/minute
- Yoga: 6 points/minute
- Walking: 5 points/minute
- Other: 5 points/minute

## 📝 Environment Variables

Backend `.env`:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit-tracker
NODE_ENV=development
```

## 🛡️ Forwarded Ports

- `8000`: Backend API (public)
- `5173`: Frontend (public)
- `27017`: MongoDB (private)

## 👥 Contributors

Built with GitHub Copilot Agent Mode for Mergington High School.

## 📄 License

ISC
