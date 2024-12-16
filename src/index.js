import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Routes import
import authRoutes from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRoutes);

app.get("/health-check", (req, res) => {
  res.status(200).json({
    message: "Hello from backend!",
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server running...`);
});
