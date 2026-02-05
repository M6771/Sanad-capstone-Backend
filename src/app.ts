import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { notFound } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import usersRoutes from "./modules/users/users.routes";
import childrenRoutes from "./modules/children/children.routes";
// TODO: Add other routes when implemented
// import authRoutes from "./modules/auth/auth.routes";
// import directoryRoutes from "./modules/directory/directory.routes";
// import carePathRoutes from "./modules/care-path/carePath.routes";
// import communityRoutes from "./modules/community/community.routes";

const app = express();

// CORS configuration - allows frontend ports (React: 3000, Expo: 19006, etc.)
// In development, allow all local network IPs for simulator access
const isDevelopment = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",    // React development server
        "http://localhost:19006",   // Expo web
        "http://127.0.0.1:3000",
        "http://127.0.0.1:19006",
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ];

      // In development, allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      if (isDevelopment) {
        const localNetworkPattern = /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[01])\.\d+\.\d+)(:\d+)?$/;
        if (localNetworkPattern.test(origin)) {
          return callback(null, true);
        }
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "2mb" }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (_req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText =
    dbStatus === 0
      ? "disconnected"
      : dbStatus === 1
        ? "connected"
        : dbStatus === 2
          ? "connecting"
          : "disconnecting";

  res.json({
    ok: true,
    name: "sanad-api",
    database: dbStatusText,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/users", usersRoutes); // /api/users/login, /api/users/me
app.use("/api/children", childrenRoutes);
// app.use("/", directoryRoutes); // /centers, /professionals
// app.use("/care-paths", carePathRoutes);
// app.use("/", communityRoutes); // /posts

app.use(notFound);
app.use(errorMiddleware);

export default app;
