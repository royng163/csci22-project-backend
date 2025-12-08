import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import initializeDB from "./utils/dbInitializer";
import authRoutes from "./routes/authRoutes";
import locationRoutes from "./routes/locationRoutes";
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
	initializeDB();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
	res.send("API is running...");
});

// Start server
app.listen(3000);
