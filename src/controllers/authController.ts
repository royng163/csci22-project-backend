import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET as string, {
		expiresIn: "30d",
	});
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const userExists = await User.findOne({ username });

	if (userExists) {
		return res.status(400).json({ message: "User already exists" });
	}

	const user = await User.create({
		username,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			role: user.role,
			token: generateToken(user._id.toString()),
		});
	} else {
		res.status(400).json({ message: "Invalid user data" });
	}
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			username: user.username,
			role: user.role,
			token: generateToken(user._id.toString()),
		});
	} else {
		res.status(401).json({ message: "Invalid username or password" });
	}
};

export { registerUser, loginUser };
