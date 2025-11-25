const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = (passport) => {
     const opts = {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET,
     };

     passport.use(
          new JwtStrategy(opts, async (jwt_payload, done) => {
               try {
                    const user = await User.findById(jwt_payload.id).select("-password");
                    if (user) return done(null, user); // req.user will be set
                    return done(null, false);
               } catch (err) {
                    return done(err, false);
               }
          })
     );
};
