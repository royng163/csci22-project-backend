import { model, Schema, Document } from "mongoose";

export interface IVenue extends Document {
	venueId: string;
	name: string;
	nameChinese?: string;
	latitude: number;
	longitude: number;
	area: string;
	district: string;
	events?: any[];
	comments?: any[];
}

const VenueSchema = new Schema(
	{
		venueId: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		nameChinese: {
			type: String,
		},
		latitude: {
			type: Number,
			required: true,
		},
		longitude: {
			type: Number,
			required: true,
		},
		area: {
			type: String,
			default: "Other",
		},
		district: {
			type: String,
			default: "Other",
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual populate for events
VenueSchema.virtual("events", {
	ref: "Event",
	localField: "_id",
	foreignField: "venue",
	justOne: false,
});

// Virtual populate for comments
VenueSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "venue",
	justOne: false,
});

const Venue = model<IVenue>("Venue", VenueSchema);
export default Venue;
