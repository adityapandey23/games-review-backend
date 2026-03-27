import express from "express";
import { errorHandler } from "./middlewares/error.js";
import authRoutes from "./controllers/auth.controller.js";
import gamesRoutes from "./controllers/games.controller.js";
import reviewsRoutes from "./controllers/reviews.controller.js";

export const app = express();

app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/games/review", reviewsRoutes);

app.use(errorHandler);
