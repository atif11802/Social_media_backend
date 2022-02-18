const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
	const exist = await User.findOne({ email: req.body.email });

	if (exist) return res.status(403).json({ err: "Email already exists" });

	const user = new User(req.body);

	try {
		await user.save();
		return res.json({ success: true });
	} catch (err) {
		return res.status(400).json({ err });
	}
};

exports.signin = (req, res) => {
	//find based on email
	const { email, password } = req.body;

	User.findOne({ email }, async (err, user) => {
		if (err || !user) return res.status(404).json({ err: "auth error" });
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) return res.status(400).json({ err: "auth error" });

		//generate token
		var token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});

		res.cookie("t", token, { expire: new Date() + 9999 });
		//return response with user and token to frontend client
		const { _id, name, email, role } = user;
		return res.json({
			token: token,
			user: { _id, name, email, role },
		});
	});
};

exports.signOut = (req, res) => {
	res.clearCookie("t");
	return res.json({ msg: "signout success" });
};

exports.requireSignin = async (req, res, next) => {
	let token = req.headers.authorization;

	if (!token) {
		return res.status(400).json({ err: "token required" });
	}
	token = token.replace("Bearer ", "").trim();

	try {
		var decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.auth = decoded;

		next();
	} catch (err) {
		return res.status(401).json({ err: "token is not valid" });
	}
};
