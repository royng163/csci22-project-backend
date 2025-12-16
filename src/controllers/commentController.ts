import { Request, Response } from "express";
import Comment from "../models/Comment";
import Venue from "../models/Venue";

// @desc    Add a comment
// @route   POST /api/comments/:venueId
// @access  Private
const addComment = async (req: Request, res: Response) => {
	const { text } = req.body;
	const venueId = req.params.venueId;

	try {
		const venue = await Venue.findById(venueId);

		if (!venue) {
			return res.status(404).json({ message: "Venue not found" });
		}

		if (!req.user) {
			return res.status(401).json({ message: "Not authorized" });
		}

		const comment = await Comment.create({
			user: req.user._id,
			venue: venueId,
			text,
		});

		const populatedComment = await Comment.findById(comment._id).populate("user", "username");

		res.status(201).json(populatedComment);
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// @desc    Get comments for a venue
// @route   GET /api/comments/:venueId
// @access  Public (or Private depending on your needs)
const getComments = async (req: Request, res: Response) => {
	const { venueId } = req.params;

	try {
		const comments = await Comment.find({ venue: venueId })
			.populate("user", "username") // Important: Get the username, not just ID
			.sort({ createdAt: -1 });     // Sort by newest first

		res.status(200).json(comments);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// Update the export
export { addComment, getComments };
