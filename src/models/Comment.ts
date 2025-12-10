import mongoose, { model, Schema } from "mongoose";

const CommentSchema: Schema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	venue: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Venue",
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

const Comment = model("Comment", CommentSchema);
export default Comment;
