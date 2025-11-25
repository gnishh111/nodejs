const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
     try {
          const { name, email, password } = req.body;

          const exists = await User.findOne({ email });
          if (exists) return res.status(400).json({ msg: "Email already exists" });

          const hashed = await bcrypt.hash(password, 10);

          const user = new User({
               name,
               email,
               password: hashed,
          });

          await user.save();

          const payload = { id: user._id };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

          res.json({
               status: true,
               message: "Signup successful",
               token: token,
               user_details: user
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};

exports.login = async (req, res) => {
     try {
          const { email, password } = req.body;

          const user = await User.findOne({ email }).select("+password");
          if (!user) return res.status(400).json({ msg: "User not found" });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

          const payload = { id: user._id };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

          res.json({
               status: true,
               message: "Login successful",
               token: token,
               user_details: user
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};

exports.updatePassword = async (req, res) => {
     try {
          const { old_password, new_password } = req.body;
          const userId = req.user.id;

          if (!old_password || !new_password) {
               return res.status(400).json({
                    success: false,
                    message: "Please provide both old and new passwords."
               });
          }
          if (new_password.length < 7) {
               return res.status(400).json({
                    success: false,
                    message: "New password must be at least 7 characters."
               });
          }
          const user = await User.findById(userId).select('+password');
          if (!user) {
               return res.status(404).json({
                    success: false,
                    message: "Authenticated user not found."
               });
          }
          const isMatch = await bcrypt.compare(old_password, user.password);
          if (!isMatch) {
               return res.status(401).json({
                    success: false,
                    message: "Incorrect old password."
               });
          }
          const hashedNewPassword = await bcrypt.hash(new_password, 10);
          user.password = hashedNewPassword;
          await user.save();
          res.json({
               success: true,
               message: "Password updated successfully."
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};