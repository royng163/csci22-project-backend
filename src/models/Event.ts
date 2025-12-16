import mongoose, { model, Schema, Document } from "mongoose";

export interface IEvent extends Document {
	eventId: number;
	title: string;
	titleChinese?: string;
	dateTime: string;
	dateTimeChinese?: string;
	duration?: string;
	durationChinese?: string;
	venue: mongoose.Types.ObjectId;
	price?: string;
	description?: string;
	descriptionChinese?: string;
	url?: string;
	ticketAgentUrl?: string;
	telephone?: string;
	presentor?: string;
	presenterChinese?: string;
}

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
	venue: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Venue",
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

const Event = model<IEvent>("Event", EventSchema);
export default Event;
