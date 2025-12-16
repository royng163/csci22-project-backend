import express from "express";
import { getVenues, getVenueById, createVenue, updateVenue, deleteVenue } from "../controllers/venueController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(getVenues).post(protect, admin, createVenue);

router.route("/:id").get(getVenueById).put(protect, admin, updateVenue).delete(protect, admin, deleteVenue);

export default router;
