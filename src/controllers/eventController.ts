import { Request, Response } from "express";
import Event from "../models/Event";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req: Request, res: Response) => {
	try {
		const events = await Event.find().populate("location");
		res.json(events);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req: Request, res: Response) => {
	const { title, location, dateTime, description, presenter, price } = req.body;

	try {
		const event = new Event({
			title,
			location,
			dateTime,
			description,
			presenter,
			price,
		});

		const createdEvent = await event.save();
		res.status(201).json(createdEvent);
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req: Request, res: Response) => {
	const { title, location, dateTime, description, presenter, price } = req.body;

	try {
		const event = await Event.findById(req.params.id);

		if (event) {
			event.title = title || event.title;
			event.location = location || event.location;
			event.dateTime = dateTime || event.dateTime;
			event.description = description || event.description;
			event.presenter = presenter || event.presenter;
			event.price = price || event.price;

			const updatedEvent = await event.save();
			res.json(updatedEvent);
		} else {
			res.status(404).json({ message: "Event not found" });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req: Request, res: Response) => {
	try {
		const event = await Event.findById(req.params.id);

		if (event) {
			await event.deleteOne();
			res.json({ message: "Event removed" });
		} else {
			res.status(404).json({ message: "Event not found" });
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export { getEvents, createEvent, updateEvent, deleteEvent };
