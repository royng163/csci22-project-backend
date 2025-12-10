import express from "express";
import { addComment } from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:venueId", protect, addComment);

export default router;
