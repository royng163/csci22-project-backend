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

// @desc    Add favorite venue
// @route   POST /api/users/favorites/:id
// @access  Private
const addFavorite = async (req: Request, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const user = await User.findById(req.user._id);
	const venueId = new mongoose.Types.ObjectId(req.params.id);

	if (user) {
		if (!user.favorites.includes(venueId)) {
			user.favorites.push(venueId);
			await user.save();
		}
		res.json(user.favorites);
	} else {
		res.status(404).json({ message: "User not found" });
	}
};

// @desc    Remove favorite venue
// @route   DELETE /api/users/favorites/:id
// @access  Private
const removeFavorite = async (req: Request, res: Response) => {
	if (!req.user) {
		return res.status(401).json({ message: "Not authorized" });
	}
	const user = await User.findById(req.user._id);
	const venueId = req.params.id;

	if (user) {
		user.favorites = user.favorites.filter((fav) => fav.toString() !== venueId);
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
	try {
		const users = await User.find().select("-password");
		res.json(users);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create a user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req: Request, res: Response) => {
	const { username, password, role } = req.body;

	try {
		const userExists = await User.findOne({ username });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = await User.create({
			username,
			password,
			role: role || "user",
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				username: user.username,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
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
			// Update username if provided and not taken
			if (req.body.username) {
				const userExists = await User.findOne({ username: req.body.username });
				if (userExists) {
					return res.status(400).json({ message: "User with this username already exists" });
				}

				user.username = req.body.username;
			}

			// Update role if provided
			user.role = req.body.role || user.role;

			// Update password if provided
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
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) {
			// Keep at least one admin user
			if (user.role === "admin") {
				const adminCount = await User.countDocuments({ role: "admin" });
				if (adminCount <= 1) {
					return res.status(400).json({ message: "There must be at least one admin user" });
				}
			}

			await user.deleteOne();
			res.json({ message: "User removed" });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export { getUserProfile, addFavorite, removeFavorite, getUsers, createUser, updateUser, deleteUser };
