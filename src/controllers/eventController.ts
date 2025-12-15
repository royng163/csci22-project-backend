import { Request, Response } from "express";
import Event, { IEvent } from "../models/Event";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find().populate("venue");
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req: Request, res: Response) => {
    const {
        title,
        titleChinese,
        dateTime,
        dateTimeChinese,
        duration,
        durationChinese,
        venue,
        price,
        description,
        descriptionChinese,
        url,
        ticketAgentUrl,
        telephone,
        presenter,
        presenterChinese,
    } = req.body;

    try {
        // Auto-generate eventId by finding the max eventId and adding 1
        const lastEvent = (await Event.findOne().sort({ eventId: -1 }).limit(1)) as IEvent | null;
        const newEventId = lastEvent ? lastEvent.eventId + 1 : 1;

        const event = new Event({
            eventId: newEventId,
            title,
            titleChinese,
            dateTime,
            dateTimeChinese,
            duration,
            durationChinese,
            venue,
            price,
            description,
            descriptionChinese,
            url,
            ticketAgentUrl,
            telephone,
            presentor: presenter,
            presenterChinese,
        });

        const createdEvent = await event.save();

        // Populate venue before sending response
        await createdEvent.populate("venue");

        res.status(201).json(createdEvent);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id).populate("venue");

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req: Request, res: Response) => {
    const {
        title,
        titleChinese,
        dateTime,
        dateTimeChinese,
        duration,
        durationChinese,
        venue,
        price,
        description,
        descriptionChinese,
        url,
        ticketAgentUrl,
        telephone,
        presenter,
        presenterChinese,
    } = req.body;

    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            // Note: eventId should NOT be updatable
            event.title = title || event.title;
            event.titleChinese = titleChinese || event.titleChinese;
            event.dateTime = dateTime || event.dateTime;
            event.dateTimeChinese = dateTimeChinese || event.dateTimeChinese;
            event.duration = duration || event.duration;
            event.durationChinese = durationChinese || event.durationChinese;
            event.venue = venue || event.venue;
            event.price = price || event.price;
            event.description = description || event.description;
            event.descriptionChinese = descriptionChinese || event.descriptionChinese;
            event.url = url || event.url;
            event.ticketAgentUrl = ticketAgentUrl || event.ticketAgentUrl;
            event.telephone = telephone || event.telephone;
            event.presentor = presenter || event.presentor;
            event.presenterChinese = presenterChinese || event.presenterChinese;

            const updatedEvent = await event.save();

            // Populate venue before sending response
            await updatedEvent.populate("venue");

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

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };