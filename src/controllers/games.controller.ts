import { Router } from "express";
import { db } from "../db/index.js";
import { gamesTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { createGameSchema, updateGameSchema } from "../dtos/games.dto.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

// GET all games with pagination
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const games = await db.select().from(gamesTable).limit(limit).offset(offset).orderBy(desc(gamesTable.createdAt));
    
    return res.status(200).json({ data: games, page, limit });
  } catch (error) {
    next(error);
  }
});

// GET single game
router.get("/:gameId", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const games = await db.select().from(gamesTable).where(eq(gamesTable.id, gameId)).limit(1);
    
    if (games.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    return res.status(200).json({ data: games[0] });
  } catch (error) {
    next(error);
  }
});

// POST new game
router.post("/", authenticate, async (req, res, next) => {
  try {
    const data = createGameSchema.parse(req.body);

    const [newGame] = await db.insert(gamesTable).values(data).returning();

    return res.status(201).json({ message: "Game created successfully", data: newGame });
  } catch (error) {
    next(error);
  }
});

// PATCH update game
router.patch("/:gameId", authenticate, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const data = updateGameSchema.parse(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No data provided to update" });
    }

    const [updatedGame] = await db.update(gamesTable)
      .set(data)
      .where(eq(gamesTable.id, gameId))
      .returning();

    if (!updatedGame) {
      return res.status(404).json({ error: "Game not found" });
    }

    return res.status(200).json({ message: "Game updated", data: updatedGame });
  } catch (error) {
    next(error);
  }
});

// DELETE game
router.delete("/:gameId", authenticate, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    
    const [deletedGame] = await db.delete(gamesTable).where(eq(gamesTable.id, gameId)).returning();

    if (!deletedGame) {
      return res.status(404).json({ error: "Game not found" });
    }

    return res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
