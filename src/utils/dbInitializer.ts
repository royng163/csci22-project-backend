import axios from "axios";
import xml2js from "xml2js";
import Venue from "../models/Venue";
import Event from "../models/Event";

const getAddress = async (lat: number, lng: number): Promise<{ area: string; district: string }> => {
	try {
		const response = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.MAP_API_KEY}&language=en`
		);

		const result = response.data.results[0];
		const districtComponent = result.address_components.find((c: any) => c.types.includes("neighborhood"));
		const areaComponent = result.address_components.find((c: any) => c.types.includes("administrative_area_level_1"));

		const district = districtComponent ? districtComponent.long_name : "Other";
		const area = areaComponent ? areaComponent.long_name : "Other";

		return { area, district };
	} catch (error) {
		console.error(`Geocoding error for ${lat},${lng}:`, error);
	}

	return { area: "Other", district: "Other" };
};

const initializeDB = async (): Promise<void> => {
	try {
		// Check if data already exists
		const count = await Event.countDocuments();
		if (count > 0) {
			console.log("Data already exists in database. Skipping database initialization.");
			return;
		}

		// Populate database if database is empty
		console.log("Initializing database by fetching from data source...");
		const parser = new xml2js.Parser({ explicitArray: false });

		// Populate Venue Table
		const venuesResponse = await axios.get("https://www.lcsd.gov.hk/datagovhk/event/venues.xml");
		const venuesResult = await parser.parseStringPromise(venuesResponse.data);
		const venuesList = venuesResult.venues.venue;
		for (const venueData of venuesList) {
			const eventLatitude = parseFloat(venueData.latitude);
			const eventLongitude = parseFloat(venueData.longitude);

			// Skip venues without latitude or longitude
			if (isFinite(eventLatitude) && isFinite(eventLongitude)) {
				const { area, district } = await getAddress(eventLatitude, eventLongitude);

				const venue = new Venue({
					venueId: venueData.$.id,
					name: venueData.venuee,
					nameChinese: venueData.venuec,
					latitude: eventLatitude,
					longitude: eventLongitude,
					area,
					district,
				});
				await venue.save();
			}
		}

		// Populate Event Table
		const eventResponse = await axios.get("https://www.lcsd.gov.hk/datagovhk/event/events.xml");
		const eventResult = await parser.parseStringPromise(eventResponse.data);
		const eventList = eventResult.events.event;
		for (const eventData of eventList) {
			const venue = await Venue.findOne({ venueId: eventData.venueid });

			// Skip events without valid venue
			if (venue) {
				const event = new Event({
					eventId: eventData.$.id,
					title: eventData.titlee,
					titleChinese: eventData.titlec,
					dateTime: eventData.predateE,
					dateTimeChinese: eventData.predateC,
					duration: eventData.progtimee,
					durationChinese: eventData.progtimec,
					venue: venue._id,
					price: eventData.pricee,
					description: eventData.desce,
					descriptionChinese: eventData.descc,
					url: eventData.urle,
					ticketAgentUrl: eventData.tagenturle,
					telephone: eventData.enquiry,
					presentor: eventData.presenterorge,
					presenterChinese: eventData.presenterorgc,
				});
				await event.save();
			}
		}

		console.log("Database initialization completed.");
	} catch (error) {
		console.error("Error initializing database:", error);
	}
};

export default initializeDB;
