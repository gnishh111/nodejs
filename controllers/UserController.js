const User = require('../models/User');

exports.getUsers = async (req, res) => {
     try {
          const users = await User.find();
          res.json({
               success: true,
               users_list: users
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};

exports.getProfile = async (req, res) => {
     try {
          res.json({
               success: true,
               user_details: req.user
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};
