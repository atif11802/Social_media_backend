require("dotenv").config();
const express = require("express");
const postRoutes = require("./routes/Post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const app = express();
const morgan = require("morgan");
const port = 8000 || process.env.PORT;
const { db } = require("./db/database");
var cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
db();

//api docs
app.get("/", (req, res) => {
	fs.readFile("docs/apiDocs.json", (err, data) => {
		if (err) throw err;
		res.json(JSON.parse(data));
	});
});

app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
