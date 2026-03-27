import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { registerSchema, loginSchema } from "../dtos/auth.dto.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const [newUser] = await db.insert(usersTable).values({
      email: data.email,
      password: hashedPassword,
    }).returning({ id: usersTable.id, email: usersTable.email });

    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const users = await db.select().from(usersTable).where(eq(usersTable.email, data.email)).limit(1);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
});

export default router;
