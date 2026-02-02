import express from "express";
import connectDB from "./config/db";
import { env } from "./config/env";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: { message: "Server is running" },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
