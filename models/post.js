const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		body: {
			type: String,
			required: true,
			trim: true,
		},
		photo: {
			type: String,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				text: String,
				createdAt: { type: Date, default: Date.now },
				postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Post", postSchema);
