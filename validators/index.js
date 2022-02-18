const { check, validationResult } = require("express-validator");

exports.createPostValidator = [
	check("title")
		.isLength({ min: 3 })
		.withMessage("Title must be at least 3 characters long")
		.notEmpty()
		.withMessage("title is required"),

	check("body")
		.isLength({ min: 3 })
		.withMessage("Body must be at least 3 characters long")
		.notEmpty()
		.withMessage("body is required"),
];

exports.userSignUp = [
	check("name")
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3 })
		.withMessage("Name must be at least 3 characters long"),

	check("email").isEmail().withMessage({
		message: "Not an email",
		code: "INVALID_EMAIL",
	}),
	check("password", "The password must be 5+ chars long and contain a number")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 chars long")
		.not()
		.isIn(["123456", "password", "god"])
		.withMessage("Do not use a common word as the password"),
];

exports.userSignIn = [
	check("email").isEmail().withMessage({
		message: "Not an email",
		code: "INVALID_EMAIL",
	}),
	check("password", "The password must be 5+ chars long and contain a number")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 chars long")
		.not(),
];

exports.isRequestValidate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ err: errors.array()[0].msg });
	}
	next();
};
