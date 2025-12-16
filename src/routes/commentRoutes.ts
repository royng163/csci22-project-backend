import express from "express";
import { addComment, getComments } from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:venueId", protect, addComment);

router.get("/:venueId", getComments);

export default router;
