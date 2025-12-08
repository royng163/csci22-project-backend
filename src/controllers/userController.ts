import { Request, Response } from "express";
import User from "../models/User";
import mongoose from "mongoose";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req: Request, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const user = await User.findById(req.user._id).populate("favorites");

	if (user) {
		res.json({
			_id: user._id,
			username: user.username,
			role: user.role,
			favorites: user.favorites,
		});
	} else {
		res.status(404).json({ message: "User not found" });
	}
};

// @desc    Add favorite location
// @route   POST /api/users/favorites/:id
// @access  Private
const addFavorite = async (req: Request, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const user = await User.findById(req.user._id);
	const locationId = new mongoose.Types.ObjectId(req.params.id);

	if (user) {
		if (!user.favorites.includes(locationId)) {
			user.favorites.push(locationId);
			await user.save();
		}
		res.json(user.favorites);
	} else {
		res.status(404).json({ message: "User not found" });
	}
};

// @desc    Remove favorite location
// @route   DELETE /api/users/favorites/:id
// @access  Private
const removeFavorite = async (req: Request, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const user = await User.findById(req.user._id);
	const locationId = req.params.id;

	if (user) {
		user.favorites = user.favorites.filter((fav) => fav.toString() !== locationId);
		await user.save();
		res.json(user.favorites);
	} else {
		res.status(404).json({ message: "User not found" });
	}
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req: Request, res: Response) => {
	const users = await User.find({});
	res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) {
			await user.deleteOne();
			res.json({ message: "User removed" });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) {
			user.username = req.body.username || user.username;
			if (req.body.password) {
				user.password = req.body.password;
			}

			const updatedUser = await user.save();
			res.json({
				_id: updatedUser._id,
				username: updatedUser.username,
				role: updatedUser.role,
			});
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export { getUserProfile, addFavorite, removeFavorite, getUsers, deleteUser, updateUser };
