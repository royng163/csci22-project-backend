import { Request, Response } from "express";
import Location from "../models/Location";

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = async (req: Request, res: Response) => {
	try {
		const { keyword, sort } = req.query;
		let query: any = {};

		if (keyword) {
			query.name = { $regex: keyword, $options: "i" };
		}

		let locations = await Location.find(query).populate("events");

		// Sorting (basic implementation)
		if (sort === "name") {
			locations.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sort === "events") {
			locations.sort((a, b) => (b.events?.length || 0) - (a.events?.length || 0));
		}
		// Distance sorting would require user coordinates passed in query

		res.json(locations);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
const getLocationById = async (req: Request, res: Response) => {
	try {
		const location = await Location.findById(req.params.id)
			.populate("events")
			.populate({
				path: "comments",
				populate: { path: "user", select: "username" },
			});

		if (location) {
			res.json(location);
		} else {
			res.status(404).json({ message: "Location not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create a location
// @route   POST /api/locations
// @access  Private/Admin
const createLocation = async (req: Request, res: Response) => {
	const { name, latitude, longitude } = req.body;

	try {
		const location = new Location({
			name,
			latitude,
			longitude,
		});

		const createdLocation = await location.save();
		res.status(201).json(createdLocation);
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private/Admin
const updateLocation = async (req: Request, res: Response) => {
	const { name, latitude, longitude } = req.body;

	try {
		const location = await Location.findById(req.params.id);

		if (location) {
			location.name = name || location.name;
			location.latitude = latitude || location.latitude;
			location.longitude = longitude || location.longitude;

			const updatedLocation = await location.save();
			res.json(updatedLocation);
		} else {
			res.status(404).json({ message: "Location not found" });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private/Admin
const deleteLocation = async (req: Request, res: Response) => {
	try {
		const location = await Location.findById(req.params.id);

		if (location) {
			await location.deleteOne();
			res.json({ message: "Location removed" });
		} else {
			res.status(404).json({ message: "Location not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export { getLocations, getLocationById, createLocation, updateLocation, deleteLocation };
