import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
	title: string;
	location: mongoose.Types.ObjectId;
	dateTime: string;
	description?: string;
	presenter?: string;
	price?: string;
}

const EventSchema: Schema = new Schema({
	title: {
		type: String,
		required: true,
	},
	location: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Location",
		required: true,
	},
	dateTime: {
		type: String, // Keeping as string for flexibility with XML data, or could be Date
		required: true,
	},
	description: {
		type: String,
	},
	presenter: {
		type: String,
	},
	price: {
		// Optional, but often useful
		type: String,
	},
});

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
