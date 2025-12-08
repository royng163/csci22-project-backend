import axios from "axios";
import xml2js from "xml2js";
import Location from "../models/Location";
import Event from "../models/Event";

const DATA_URL = "https://www.lcsd.gov.hk/datagovhk/event/events.xml";

const fetchData = async (): Promise<void> => {
	try {
		// Check if data already exists
		const count = await Location.countDocuments();
		if (count > 0) {
			console.log("Data already exists in database. Skipping fetch.");
			return;
		}

		console.log("Fetching data from API...");
		const response = await axios.get(DATA_URL);
		const parser = new xml2js.Parser({ explicitArray: false });
		const result = await parser.parseStringPromise(response.data);

		const eventsData = result.events.event; // Adjust based on actual XML structure

		// Let's fetch venues.xml too just in case
		const venuesUrl = "https://www.lcsd.gov.hk/datagovhk/event/venues.xml";
		const venuesResponse = await axios.get(venuesUrl);
		const venuesResult = await parser.parseStringPromise(venuesResponse.data);

		const venuesList = venuesResult.venues.venue;
		const venueDetailsMap = new Map();

		venuesList.forEach((v: any) => {
			venueDetailsMap.set(v.venuee, {
				// Assuming 'venuee' is the English name or ID
				latitude: parseFloat(v.latitude),
				longitude: parseFloat(v.longitude),
				name: v.venuee,
			});
		});

		// Now process events
		const venueEventCounts = new Map();

		// Ensure eventsData is an array
		const eventsArray = Array.isArray(eventsData) ? eventsData : [eventsData];

		eventsArray.forEach((e: any) => {
			// Defensive check for venue property
			const vName = e.venue?.venuee; // Adjust path based on XML
			if (vName) {
				if (!venueEventCounts.has(vName)) {
					venueEventCounts.set(vName, []);
				}
				venueEventCounts.get(vName).push(e);
			}
		});

		// Filter for 10 venues with at least 3 events
		let selectedVenues: string[] = [];
		for (const [venueName, events] of venueEventCounts.entries()) {
			if (events.length >= 3) {
				selectedVenues.push(venueName);
				if (selectedVenues.length === 10) break;
			}
		}

		console.log(`Selected ${selectedVenues.length} venues.`);

		for (const venueName of selectedVenues) {
			const venueInfo = venueDetailsMap.get(venueName) || {
				name: venueName,
				latitude: 22.3193, // Default fallback (Hong Kong)
				longitude: 114.1694,
			};

			let location = await Location.findOne({ name: venueName });
			if (!location) {
				location = await Location.create({
					name: venueName,
					latitude: venueInfo.latitude,
					longitude: venueInfo.longitude,
				});
			}

			const events = venueEventCounts.get(venueName);
			for (const e of events) {
				await Event.create({
					title: e.titlee, // Assuming 'titlee' for English title
					location: location._id,
					dateTime: e.predateE || e.predate, // Adjust field name
					description: e.desce || e.desc,
					presenter: e.presenterorge || e.presenter,
					price: e.pricee || e.price,
				});
			}
		}

		console.log("Data import completed.");
	} catch (error) {
		console.error("Error fetching data:", error);
	}
};

export default fetchData;
