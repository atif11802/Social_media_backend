const express = require("express");
const { signUp, signin, signOut } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignUp, isRequestValidate, userSignIn } = require("../validators");

const router = express.Router();

router.post("/signup", userSignUp, isRequestValidate, signUp);
router.post("/signin", userSignIn, isRequestValidate, signin);
router.post("/signout", signOut);

router.param("userId", userById);

module.exports = router;
