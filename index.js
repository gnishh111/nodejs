require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/api");
const cors = require("cors");
const passport = require("passport");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

// init passport
require("./config/passport")(passport);
app.use(passport.initialize());

// ensure indexes (one-time safe op) - optional but recommended to enforce unique email
const User = require("./models/User");
User.init().catch((err) => console.error("User.init() error:", err));

// routes
app.use("/api/v1/Authenticate", authRoutes);

// start API server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // or use specific IP like "192.168.1.50"
app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
