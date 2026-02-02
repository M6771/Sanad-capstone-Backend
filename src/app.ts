import express from "express";
import connectDB from "./database";
import cors from "cors";
import morgan from "morgan";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8000;
connectDB();

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
