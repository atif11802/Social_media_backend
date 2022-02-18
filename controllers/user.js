const User = require("../models/user");
const _ = require("lodash");

exports.userById = (req, res, next, id) => {
	// console.log(id);
	User.find({ _id: id })
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((err, data) => {
			if (err || !data) return res.status(400).json({ err: "User not found" });

			req.profile = data; //adds data of user to req.profile

			next();
		});
};

exports.hasAuthorization = (req, res, next) => {
	let authorized = req.profile && req.auth && req.profile._id === req.auth._id;
	if (!authorized)
		return res.status(403).json({ err: "User is not authorized" });
	next();
};

exports.allUsers = (req, res) => {
	User.find({}, (err, data) => {
		if (err || !data) return res.status(400).json({ err: "No users found" });

		res.json(data);
	}).select("name email updated createdAt ");
};

exports.getUser = (req, res) => {
	if (req.profile.length === 0) {
		return res.status(400).json({ err: "User not found" });
	}
	req.profile[0].password = undefined;
	return res.json(req.profile);
};

exports.updateUser = (req, res) => {
	let user = req.profile[0];
	user = _.extend(user, req.body);

	user.save((err, user) => {
		if (err) return res.status(400).json({ err: "You are not authorized" });

		user.password = undefined;
		return res.json(user);
	});
};

exports.deleteUser = (req, res) => {
	let user = req.profile[0];
	user.remove((err, user) => {
		if (err) return res.status(400).json({ err: "You are not authorized" });

		user.password = undefined;
		return res.json({
			msg: "User deleted successfully",
		});
	});
};

// follow unfollow users
exports.addFollowing = (req, res, next) => {
	User.findByIdAndUpdate(
		req.body.userId,
		{ $push: { following: req.body.followId } },
		(err, result) => {
			if (err) {
				return res.status(400).json({ error: err });
			}
			next();
		}
	);
};

exports.addFollower = (req, res) => {
	console.log(req.body.followId, req.body.userId);
	User.findByIdAndUpdate(
		req.body.followId,
		{ $push: { followers: req.body.userId } },
		{ new: true }
	)
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			result.password = undefined;
			result.salt = undefined;
			res.json(result);
		});
};

exports.removeFollowing = (req, res, next) => {
	console.log(req.body.userId, req.body.unfollowId);
	User.findByIdAndUpdate(
		req.body.userId,
		{ $pull: { following: req.body.unfollowId } },
		(err, result) => {
			if (err) {
				return res.status(400).json({ error: err });
			}
			next();
		}
	);
};

exports.removeFollwer = (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowId,
		{ $pull: { followers: req.body.userId } },
		{ new: true }
	)
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					err,
				});
			}
			result.password = undefined;
			return res.json(result);
		});
};

exports.findPeople = (req, res) => {
	let following = req.profile[0].following;
	following.push(req.profile[0]._id);
	User.find({ _id: { $nin: following } }, (err, users) => {
		if (err) {
			return res.status(400).json({
				err,
			});
		}

		res.json(users);
	}).select("name createdAt");
};
