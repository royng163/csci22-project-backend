import { model, Schema } from "mongoose";

export interface ILocation {
	locationId: string;
	name: string;
	nameChinese?: string;
	latitude: number;
	longitude: number;
	events?: any[];
	comments?: any[];
}

const LocationSchema = new Schema(
	{
		locationId: {
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

const Location = model("Location", LocationSchema);
export default Location;
