const express = require("express");
const { requireSignin } = require("../controllers/auth");
const {
	allUsers,
	userById,
	getUser,
	updateUser,
	deleteUser,
	addFollowing,
	addFollower,
	removeFollowing,
	removeFollwer,
	findPeople,
} = require("../controllers/user");
const router = express.Router();

router.put("/users/follow", requireSignin, addFollowing, addFollower);
router.put("/users/unfollow", requireSignin, removeFollowing, removeFollwer);
router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);
router.get("/user/findPeople/:userId", requireSignin, findPeople);

router.param("userId", userById);

module.exports = router;
