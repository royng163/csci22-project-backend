import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILocation extends Document {
	name: string;
	latitude: number;
	longitude: number;
	events?: any[]; // Virtual
	comments?: any[]; // Virtual
}

const LocationSchema: Schema = new Schema(
	{
		name: {
			// Venue name
			type: String,
			required: true,
			unique: true,
		},
		latitude: {
			type: Number,
			required: true,
		},
		longitude: {
			type: Number,
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual populate for events
LocationSchema.virtual("events", {
	ref: "Event",
	localField: "_id",
	foreignField: "location",
	justOne: false,
});

// Virtual populate for comments
LocationSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "location",
	justOne: false,
});

const Location: Model<ILocation> = mongoose.model<ILocation>("Location", LocationSchema);
export default Location;
