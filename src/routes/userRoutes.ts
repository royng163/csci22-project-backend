import express from "express";
import {
	getUserProfile,
	addFavorite,
	removeFavorite,
	getUsers,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/userController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.post("/favorites/:id", protect, addFavorite);
router.delete("/favorites/:id", protect, removeFavorite);

router.route("/").get(protect, admin, getUsers).post(protect, admin, createUser);

router.route("/:id").put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;
