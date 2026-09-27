import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import notesRouter from "./routes/notesRoutes.js";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import ratelimiter from "./middleware/middleware.js";

const app = express();
const PORT = process.env.PORT || 5001;
const IS_PROD = process.env.NODE_ENV === "production";

// Resolve __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Security Headers ---
app.use(
  helmet({
    contentSecurityPolicy: IS_PROD ? undefined : false, // Let Vite's dev HMR work
  })
);

// --- CORS ---
// In production the static site is served from the same origin, so CORS is only
// needed for external clients. Restrict the origin explicitly in production.
const allowedOrigins = IS_PROD
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

// Fail-open: if FRONTEND_URL is not set in production, log a warning but allow localhost for testing
if (IS_PROD && !process.env.FRONTEND_URL) {
  console.warn("⚠️  FRONTEND_URL not set in production. CORS will allow all origins as fallback.");
}

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);

// --- Body Parsing ---
app.use(express.json({ limit: "1mb" }));

// --- Rate Limiting ---
app.use(ratelimiter);

// --- API Routes ---
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);

// --- API 404 (must come before any static/SPA handling) ---
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// --- Serve Frontend (only when SERVE_STATIC=true) ---
// Frontend and backend are deployed separately (Vercel + Render), so this stays
// off by default. Enable it only if you ever deploy them as one combined service.
if (process.env.SERVE_STATIC === "true") {
  const clientDist = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(clientDist));

  // Send index.html for any unknown route so React Router works
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// --- Start Server ---
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT} (${IS_PROD ? "production" : "development"})`);
  });
});
