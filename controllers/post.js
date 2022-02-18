const Post = require("../models/post");
const _ = require("lodash");

exports.postById = (req, res, next, id) => {
	Post.findById({ _id: id })
		.populate("postedBy", "_id name")
		.populate("comments", "text createdAt")
		.populate("comments.postedBy", "_id name")
		.exec((err, post) => {
			if (err || !post) {
				return res.status(400).json({
					err: "Post not found",
				});
			}

			req.post = post;
			next();
		});
};

exports.getPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.select("-__v ")
			.populate("postedBy", "name email createdAt likes ")
			.populate("comments", "text createdAt")
			.populate("comments.postedBy", "_id name")
			.sort({ createdAt: -1 });

		res.json({
			message: "success",
			posts,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.createPost = async (req, res, next) => {
	try {
		const { title, body, postedBy } = req.body;
		const post = new Post({
			title,
			body,
			postedBy,
		});

		const newPost = await post.save(function (err, post) {
			post.populate("postedBy", "name email createdAt", function (err, post) {
				console.log(post);

				res.json(post);
				// Do something
			});
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			message: err,
		});
	}
};

exports.postsByUser = (req, res) => {
	// console.log(req.profile);
	Post.find({ postedBy: req.profile[0]._id })
		.populate("postedBy", "name email likes")
		.sort("_createdAt")
		.exec((err, post) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			res.json(post);
		});
};

exports.isPoster = (req, res, next) => {
	let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
	if (!isPoster) {
		return res.status(403).json({
			err: "User is not defined",
		});
	}
	next();
};

exports.deletePost = (req, res) => {
	let post = req.post;
	post.remove((err, post) => {
		if (err) {
			return res.status(400).json({ err: "Failed to delete post" });
		}
		res.json({
			message: "Post deleted successfully",
		});
	});
};

exports.updatePost = (req, res, next) => {
	let post = req.post;
	post = _.extend(post, req.body);

	post.save((err, post) => {
		if (err) {
			return res.status(400).json({ err: "Failed to update post" });
		}
		res.json(post);
	});
};

exports.singlePost = (req, res) => {
	return res.status(200).json(req.post);
};

exports.like = (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{ $push: { likes: req.body.userId } },
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				err,
			});
		}
		return res.status(200).json(result);
	});
};

exports.unLike = (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{ $pull: { likes: req.body.userId } },
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(400).json({
				err,
			});
		}
		return res.status(200).json(result);
	});
};

exports.comment = (req, res) => {
	let text = req.body.comment;
	let postedBy = req.body.userId;

	Post.findByIdAndUpdate(
		req.body.postId,
		{ $push: { comments: { text, postedBy } } },
		{ new: true }
	)
		.populate("comments.postedBy", "_id name")
		.populate("postedBy", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			} else {
				res.json(result);
			}
		});
};

exports.uncomment = (req, res) => {
	let comment = req.body.comment;

	Post.findByIdAndUpdate(
		req.body.postId,
		{ $pull: { comments: { _id: comment._id } } },
		{ new: true }
	)
		.populate("comments.postedBy", "_id name")
		.populate("postedBy", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					err,
				});
			}
			return res.status(200).json(result);
		});
};
