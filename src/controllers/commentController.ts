import { Request, Response } from "express";
import Comment from "../models/Comment";
import Location from "../models/Location";

// @desc    Add a comment
// @route   POST /api/comments/:locationId
// @access  Private
const addComment = async (req: Request, res: Response) => {
	const { text } = req.body;
	const locationId = req.params.locationId;

	try {
		const location = await Location.findById(locationId);

		if (!location) {
			return res.status(404).json({ message: "Location not found" });
		}

		if (!req.user) {
			return res.status(401).json({ message: "Not authorized" });
		}

		const comment = await Comment.create({
			user: req.user._id,
			location: locationId,
			text,
		});

		const populatedComment = await Comment.findById(comment._id).populate("user", "username");

		res.status(201).json(populatedComment);
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export { addComment };
