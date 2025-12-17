import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import initializeDB from "./utils/dbInitializer";
import authRoutes from "./routes/authRoutes";
import venueRoutes from "./routes/venueRoutes";
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import commentRoutes from "./routes/commentRoutes";
import { seedDefaultUsers } from "./utils/seedUsers";

// Load env vars
dotenv.config();

// Connect to database
connectDB()
	.then(async () => {
		await initializeDB();
		await seedDefaultUsers();
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
	res.send("API is running...");
});

// Export the app for deployment
export default app;

// Start server only if run locally
if (require.main === module) {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}
