import { Router } from "express";
import { db } from "../db/index.js";
import { reviewsTable, gamesTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { createReviewSchema } from "../dtos/reviews.dto.js";
import { authenticate, AuthRequest } from "../middlewares/auth.js";

const router = Router({ mergeParams: true });

// GET reviews for a game
router.get("/:gameId", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    
    // Check if game exists
    const games = await db.select().from(gamesTable).where(eq(gamesTable.id, gameId)).limit(1);
    if (games.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const reviews = await db.select().from(reviewsTable)
      .where(eq(reviewsTable.gameId, gameId))
      .orderBy(desc(reviewsTable.createdAt));
    
    return res.status(200).json({ data: reviews });
  } catch (error) {
    next(error);
  }
});

// POST review for a game
router.post("/:gameId", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { gameId } = req.params;
    const userId = req.user!.id;
    const data = createReviewSchema.parse(req.body);

    // Check if game exists
    const games = await db.select().from(gamesTable).where(eq(gamesTable.id, gameId)).limit(1);
    if (games.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const [newReview] = await db.insert(reviewsTable).values({
      gameId,
      userId,
      rating: data.rating,
      comment: data.comment,
    }).returning();

    return res.status(201).json({ message: "Review posted successfully", data: newReview });
  } catch (error) {
    next(error);
  }
});

export default router;
