# E-Diary 📔

A personal and interactive digital diary built with **React**, **Tailwind CSS**, **Framer Motion**, and an **Express / MongoDB** backend with Upstash Redis rate limiting and JWT authentication.

**🌐 Live Demo:** [e-diary-mernstack.vercel.app](https://e-diary-mernstack.vercel.app/)

---

## 🌟 Features

- 📖 **Notebook Cover Animation**: Interactive diary opening transitions with Framer Motion.
- 🔐 **JWT Authentication**: User registration and login with bcryptjs password hashing and bearer token authorization.
- 📝 **Sticky Note Cards**: Custom paper textures, color presets, random tilt angles, pin/unpin toggles.
- ⚡ **Instant SWR Caching**: Instant rendering via LocalStorage cache with background revalidation.
- 🛡️ **Security & Protection**: Rate limiting with Upstash Redis, Helmet security headers, CORS protection.
- 📱 **Responsive Design**: Works across mobile, tablet, and desktop screens.

---

## 📁 Project Structure

```
E-Diary/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB and Upstash Redis connections
│   │   ├── controllers/     # Auth and Notes logic
│   │   ├── middleware/      # JWT protection and Rate Limiting
│   │   ├── models/          # User and Note schemas
│   │   ├── routes/          # API route definitions
│   │   └── server.js        # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (NotebookCover, Dashboard, NoteCard, AuthModal, etc.)
│   │   ├── lib/             # API client, note utilities
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB Atlas** or local MongoDB database
- **Upstash Redis** account (for rate limiting)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your environment variables:
   ```env
   PORT=5001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```
5. Start the backend server:
   ```bash
   # Development (with nodemon hot-reload)
   npm run dev

   # Production
   npm start
   ```

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Production Build

To build the full-stack application for production:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Run the backend in production mode:
   ```bash
   cd ../backend
   NODE_ENV=production npm start
   ```
The backend will serve both the `/api/*` endpoints and the compiled React frontend from `frontend/dist`.

---

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user (`email`, `password`, `name`)
- `POST /api/auth/login` - Login with credentials (`email`, `password`)
- `GET /api/auth/me` - Get current user profile (Requires `Bearer <token>`)

### Notes (Protected - Requires `Bearer <token>`)
- `GET /api/notes` - Get all notes for the authenticated user
- `GET /api/notes/:id` - Get a single note by ID
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

---

## 📄 License

ISC License

---

## 🚀 Deploy (Separate: Railway + Vercel)

### Backend → Railway
1. Repo: `backend/` folder ko Railway pe connect karo
2. Environment Variables set karo:
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.vercel.app` (no trailing slash)
   - `MONGODB_URI`, `JWT_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
3. Deploy. URL mil jayega (e.g. `https://my-app.up.railway.app`).

### Frontend → Vercel
1. Import `frontend/` folder separately (ya root repo se `frontend/` select karo)
2. Add Environment Variable: `VITE_API_URL=https://your-backend.up.railway.app`
3. Build Command: `npm run build`  →  Output Directory: `dist`
4. Deploy.

**Note:** Vercel pe `VITE_API_URL` build ke waqt bake hota hai. Agar backend URL badalta hai toh Vercel pe redeploy karna padega.
