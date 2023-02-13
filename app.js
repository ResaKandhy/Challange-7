const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const PORT = 3000;
const routes = require("./routes");
require("dotenv").config();
app.use(express.json());
const passport = require("./lib/passport");

app.use(passport.initialize());
// app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.set("view engine", "ejs");
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
