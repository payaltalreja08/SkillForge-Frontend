# SkillForge Frontend

![Project Screenshot](./screenshot-frontend.png)

## About the Project
SkillForge Frontend is the client-side application for the SkillForge e-learning platform. Built with React and Vite, it provides a modern, responsive user interface for students and instructors to interact with courses, track progress, and access AI-powered features.

## Features
- User registration and login (JWT-based)
- Google OAuth authentication
- Browse, enroll, and manage courses
- Instructor dashboard and course management
- Progress tracking and streaks
- AI-powered features (Gemini API)
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Backend API running (see backend setup)

### Installation
1. Clone the repository:
   ```sh
   git clone <your-frontend-repo-url>
   cd SkillForge-Frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root of `SkillForge-Frontend` with the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure
- `src/components/` - React components
- `src/pages/` - Page-level components
- `src/utils/` - Utility functions



---

## License
MIT
