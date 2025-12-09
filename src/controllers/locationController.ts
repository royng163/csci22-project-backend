import { Request, Response } from "express";
import Location, { ILocation } from "../models/Location";

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

		let locations = (await Location.find(query).populate("events")) as ILocation[];

		// Filter locations that host at least 3 events
		locations = locations.filter((location) => location.events && location.events.length >= 3);

		// Limit to 10 locations
		locations = locations.slice(0, 10);

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
	const { locationId, name, nameChinese, latitude, longitude } = req.body;

	try {
		const location = new Location({
			locationId,
			name,
			nameChinese,
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
	const { locationId, name, nameChinese, latitude, longitude } = req.body;

	try {
		const location = await Location.findById(req.params.id);

		if (location) {
			location.locationId = locationId || location.locationId;
			location.name = name || location.name;
			location.nameChinese = nameChinese || location.nameChinese;
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
