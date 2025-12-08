import mongoose, { model, Schema } from "mongoose";

const EventSchema: Schema = new Schema({
	eventId: {
		type: Number,
		required: true,
		unique: true,
	},
	title: {
		type: String,
		required: true,
	},
	titleChinese: {
		type: String,
	},
	dateTime: {
		type: String,
		required: true,
	},
	dateTimeChinese: {
		type: String,
	},
	duration: {
		type: String,
	},
	durationChinese: {
		type: String,
	},
	location: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Location",
		required: true,
	},
	price: {
		type: String,
	},
	description: {
		// description may be empty
		type: String,
	},
	descriptionChinese: {
		type: String,
	},
	url: {
		type: String,
	},
	ticketAgentUrl: {
		type: String,
	},
	telephone: {
		type: String,
	},
	presentor: {
		// Presenter may be empty
		type: String,
	},
	presenterChinese: {
		type: String,
	},
});

const Event = model("Event", EventSchema);
export default Event;
