# ALVERGE AI

A full-stack AI chatbot application with authentication, conversation management, and modern UI, built with React (Vite) frontend and Node.js/Express backend.

---

## 🌟 Features
- **AI Chatbot**: Conversational AI with context-aware responses
- **Authentication**: Google/Firebase Auth (sign in, sign up, sign out)
- **Conversation History**: View, rename, and delete past conversations
- **Responsive UI**: Modern, mobile-friendly design
- **Secure**: CORS, input validation, and environment-based config
- **Production-ready**: Deployable to Vercel (frontend) and Render (backend)

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion, React Router, Firebase, React Toastify
- **Backend**: Node.js, Express, MongoDB (Mongoose), Firebase Admin, Groq SDK, Helmet, CORS
- **Auth**: Firebase Authentication (Google OAuth)
- **Deployment**: Vercel (frontend), Render (backend)

---

## 🚀 Live Demo
- **Frontend**: [https://alverge-ai-p5g7.vercel.app/](https://alverge-ai-p5g7.vercel.app/)
- **Backend**: [https://alvergeai.onrender.com/](https://alvergeai.onrender.com/)

---

## 📁 Project Structure
```
ALVERGE AI1/
  backend/         # Express API, MongoDB, Auth, CORS, Swagger
  frontend/        # React app, Vite, Tailwind, Auth, UI
```

---

## ⚙️ Setup Instructions

### 1. **Clone the repository**
```bash
git clone https://github.com/abhishekchauhan01x/AlvergeAI.git
cd AlvergeAI
```

### 2. **Backend Setup**
```bash
cd backend
npm install
```
- Create a `.env` file in `backend/` with:
  ```env
  MONGODB_URI=your_mongodb_uri
  GROQ_API_KEY=your_groq_api_key
  PORT=3000
  FRONTEND_URL=https://alverge-ai-p5g7.vercel.app
  # Firebase credentials...
  ```
- Start backend:
  ```bash
  npm run start
  ```

### 3. **Frontend Setup**
```bash
cd frontend
npm install
```
- Create a `.env` file in `frontend/` with:
  ```env
  VITE_API_BASE=https://alvergeai.onrender.com/api
  ```
- Start frontend (dev):
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  ```

---

## 🔑 Environment Variables

### **Backend** (`backend/.env`)
- `MONGODB_URI` - MongoDB connection string
- `GROQ_API_KEY` - API key for Groq AI
- `PORT` - Backend port (default: 3000)
- `FRONTEND_URL` - Allowed frontend URL for CORS
- `FIREBASE_*` - Firebase Admin credentials

### **Frontend** (`frontend/.env`)
- `VITE_API_BASE` - Backend API base URL
- (Firebase config is in `src/config/firebase.js`)

---

## 🛡️ Security & CORS
- Only requests from your Vercel frontend are allowed in production.
- Never commit real `.env` files or secrets to GitHub.
- All API keys and secrets must be set in environment variables.

---

## 🧪 Testing
- **Backend**: `npm test` (Jest)
- **Frontend**: `npm run test` (Vitest)

---

## 🐞 Troubleshooting
- **CORS errors**: Make sure your frontend URL is in the backend CORS config.
- **Google sign-in errors**: Add your deployed domain(s) to Firebase Auth > Settings > Authorized domains.
- **Connection errors**: Ensure backend is running and accessible from the frontend.
- **Missing dependencies**: Run `npm install` in both `backend/` and `frontend/`.

---

## 📄 License
MIT

---

## 👤 Author
- [Abhishek Chauhan](https://github.com/abhishekchauhan01x) 