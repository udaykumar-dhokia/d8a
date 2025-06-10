import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    	fullname: { type: String, required: true, unique: true },
    	email: { type: String, required: true, unique: true },
    	password: { type: String, required: true },
	},
	{ timestamps: true },
);

export default mongoose.model("User", userSchema);