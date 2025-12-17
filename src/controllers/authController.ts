import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET as string, {
		expiresIn: "30d",
	});
};

const isStrongPassword = (password: string) => {
	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSymbol = /[^A-Za-z0-9]/.test(password);
	const hasMinLen = password.length >= 8;
	return hasLower && hasUpper && hasNumber && hasSymbol && hasMinLen;
};

// @desc    Sign up a new user
// @route   POST /api/auth/signup
// @access  Public
const signupUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const cleanUsername = String(username || "").trim();
	if (!cleanUsername || !password) {
		return res.status(400).json({ message: "Username and password are required" });
	}

	const reserved = new Set(["admin", "administrator"]);
	if (reserved.has(cleanUsername.toLowerCase())) {
		return res.status(400).json({ message: "This username is reserved." });
	}

	if (!isStrongPassword(password)) {
		return res.status(400).json({
			message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
		});
	}

	const userExists = await User.findOne({ username: cleanUsername });
	if (userExists) {
		return res.status(400).json({ message: "User already exists" });
	}

	if (userExists) {
		return res.status(400).json({ message: "User already exists" });
	}

	const generatedEmail = `${cleanUsername.toLowerCase()}@local.test`;

	const user = await User.create({
		username: cleanUsername,
		email: generatedEmail,
		password,
		role: "user",
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
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
			email: user.email,
			role: user.role,
			token: generateToken(user._id.toString()),
		});
	} else {
		res.status(401).json({ message: "Invalid username or password" });
	}
};

export { signupUser, loginUser };
