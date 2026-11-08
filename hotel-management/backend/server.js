import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import path from "path";
dotenv.config();

const app = express();

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/hotels", hotelRoutes);

app.get("/", (req, res) => {
  res.send("StayEase Backend is running successfully!");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PostgreSQL connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StayEase server running on port ${PORT}`);
});
