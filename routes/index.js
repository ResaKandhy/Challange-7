const app = require("express").Router();
const { request } = require("express");
const UserController = require("../controllers/userController");
const restrict = require("../middlewares/restrict");
const { Room } = require("../models");

app.get("/register", UserController.handleRegisterPage);

app.get("/login", UserController.handleLoginPage);
app.get("/create-room", restrict, UserController.handleCreateRoom);

app.get("/fight/:id", (req, res) => {
  Room.findOne({
    where: { id: req.params.id },
  }).then((room) => {
    res.status(200).json(room);
  });
});

module.exports = app;
