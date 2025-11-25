const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
     {
          name: {
               type: String,
               required: true
          },
          email: {
               type: String,
               required: true,
               unique: true,
               lowercase: true,
               trim: true
          },
          password: {
               type: String,
               required: true,
               select: false
          },
     },
     {
          timestamps: true,
          collection: "users",
          toJSON: {
               transform: function (doc, ret) {
                    delete ret.password;
                    return ret;
               }
          }
     }
);

module.exports = mongoose.model("User", UserSchema);
