import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
	user: mongoose.Types.ObjectId;
	location: mongoose.Types.ObjectId;
	text: string;
	createdAt: Date;
}

const CommentSchema: Schema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	location: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Location",
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
