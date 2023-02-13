const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");
require("dotenv").config();

const options = {
  jwtFromRequest: ExtractJwt.fromBodyField("token"),
  secretOrKey: "Ini rahasia ga boleh disebar-sebar",
};
passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
);
module.exports = passport;
