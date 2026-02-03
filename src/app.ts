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

app.use(cors());
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

// Routes
// app.use("/auth", authRoutes);
app.use(usersRoutes); // /me
app.use("/children", childrenRoutes);
// app.use("/", directoryRoutes); // /centers, /professionals
// app.use("/care-paths", carePathRoutes);
// app.use("/", communityRoutes); // /posts

app.use(notFound);
app.use(errorMiddleware);

export default app;
