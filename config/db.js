const mongoose = require("mongoose");

const connectDB = async () => {
     try {
          await mongoose.connect(process.env.MONGO_URI); // No options needed in Mongoose 7+
          console.log("MongoDB Connected Successfully");
     } catch (error) {
          console.error("MongoDB Connection Error:", error);
          process.exit(1);
     }
};

module.exports = connectDB;
