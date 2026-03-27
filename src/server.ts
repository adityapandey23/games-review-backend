import express from "express";
import { httpLogger } from "./monitoring/logger.js";
import { httpRequestDuration, register } from "./monitoring/metrics.js";
import { errorHandler } from "./middlewares/error.js";
import authRoutes from "./controllers/auth.controller.js";
import gamesRoutes from "./controllers/games.controller.js";
import reviewsRoutes from "./controllers/reviews.controller.js";

export const app = express();

app.use(express.json());

// Observability Middlewares
app.use(httpLogger);
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
      },
      duration
    );
  });
  next();
});

// Expose Metrics
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(String(ex));
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/games/review", reviewsRoutes);

app.use(errorHandler);
