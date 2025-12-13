import { Request, Response } from "express";
import Venue, { IVenue } from "../models/Venue";

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
const getVenues = async (req: Request, res: Response) => {
	try {
		const { keyword, sort } = req.query;
		let query: any = {};

		if (keyword) {
			query.name = { $regex: keyword, $options: "i" };
		}

		let venues = (await Venue.find(query).populate("events")) as IVenue[];

		// Filter venues that host at least 3 events
		venues = venues.filter((venue) => venue.events && venue.events.length >= 3);

		// Randomize
		venues = venues.sort(() => 0.5 - Math.random());

		// Limit to 10 venues
		venues = venues.slice(0, 10);

		res.json(venues);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
const getVenueById = async (req: Request, res: Response) => {
	try {
		const venue = await Venue.findById(req.params.id)
			.populate("events")
			.populate({
				path: "comments",
				populate: { path: "user", select: "username" },
			});

		if (venue) {
			res.json(venue);
		} else {
			res.status(404).json({ message: "Venue not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create a venue
// @route   POST /api/venues
// @access  Private/Admin
const createVenue = async (req: Request, res: Response) => {
	const { venueId, name, nameChinese, latitude, longitude } = req.body;

	try {
		const venue = new Venue({
			venueId,
			name,
			nameChinese,
			latitude,
			longitude,
		});

		const createdVenue = await venue.save();
		res.status(201).json(createdVenue);
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// @desc    Update a venue
// @route   PUT /api/venues/:id
// @access  Private/Admin
const updateVenue = async (req: Request, res: Response) => {
	const { venueId, name, nameChinese, latitude, longitude } = req.body;

	try {
		const venue = await Venue.findById(req.params.id);

		if (venue) {
			venue.venueId = venueId || venue.venueId;
			venue.name = name || venue.name;
			venue.nameChinese = nameChinese || venue.nameChinese;
			venue.latitude = latitude || venue.latitude;
			venue.longitude = longitude || venue.longitude;

			const updatedVenue = await venue.save();
			res.json(updatedVenue);
		} else {
			res.status(404).json({ message: "Venue not found" });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// @desc    Delete a venue
// @route   DELETE /api/venues/:id
// @access  Private/Admin
const deleteVenue = async (req: Request, res: Response) => {
	try {
		const venue = await Venue.findById(req.params.id);

		if (venue) {
			await venue.deleteOne();
			res.json({ message: "Venue removed" });
		} else {
			res.status(404).json({ message: "Venue not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export { getVenues, getVenueById, createVenue, updateVenue, deleteVenue };
