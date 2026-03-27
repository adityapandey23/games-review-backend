import { z } from "zod";

export const createGameSchema = z.object({
  name: z.string().min(1),
  releaseYear: z.number().int().min(1950).max(2100),
  gamingStudio: z.string().min(1),
});

export const updateGameSchema = createGameSchema.partial();
