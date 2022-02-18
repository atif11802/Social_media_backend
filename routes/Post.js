const express = require("express");
const { requireSignin } = require("../controllers/auth");
const {
	getPosts,
	createPost,
	postsByUser,
	postById,
	isPoster,
	deletePost,
	updatePost,
	singlePost,
	like,
	unLike,
	uncomment,
	comment,
} = require("../controllers/post");
const { userById } = require("../controllers/user");
const { createPostValidator, isRequestValidate } = require("../validators");
const router = express.Router();

router.get("/posts", getPosts);
router.post(
	"/post",
	requireSignin,
	createPostValidator,
	isRequestValidate,
	createPost
);
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unLike);

//comments
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.get("/posts/by/:userId", requireSignin, postsByUser);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.get("/post/:postId", singlePost);

router.param("userId", userById);

router.param("postId", postById);

module.exports = router;
