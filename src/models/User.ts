import mongoose, { Document, Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
	username: string;
	email: string;
	password?: string;
	role: "user" | "admin";
	favorites: mongoose.Types.ObjectId[];
	matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	favorites: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Venue",
		},
	],
});

// Encrypt password using bcrypt
UserSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password!, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password!);
};

const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;
