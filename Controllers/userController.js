const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Room } = require("../models");
require("dotenv").config();
const saltRounds = process.env.SALTROUNDS;
const toNumber = +saltRounds;
const jwt = require("jsonwebtoken");

function format(user) {
  const { id, username } = user;

  return {
    id,
    username,
    accessToken: user.generateToken(),
  };
}

class UserController {
  static async handleRegisterPage(req, res) {
    //input database
    try {
      if (Object.keys(req.body.password).length > 6) {
        const { fullname, username, role, password } = req.body;
        const salt = bcrypt.genSaltSync(toNumber);
        const hash = bcrypt.hashSync(password, salt);

        const inputUser = {
          fullname,
          username,
          role,
          password: hash,
        };
        const result = await User.create(inputUser);
        console.log(result);
        res.json({ message: "Register berhasil, silahkan login" });
      } else {
        res.json({ message: "Password minimal 6 karakter" });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "Periksa kembali data data login anda" });
    }
  }

  static async handleLoginPage(req, res) {
    try {
      const user = await User.authenticate(req.body);
      res.json(format(user));
    } catch (error) {
      res.json(403, { message: "Login failed!" });
    }
  }
  static async handleCreateRoom(req, res) {
    const token = req.body.token;

    if (token) {
      const decode = jwt.verify(token, "Ini rahasia ga boleh disebar-sebar");

      const { name_room, player_one_id, player_two_id } = req.body;
      const roomIsExist = await Room.findOne({
        where: {
          name_room,
        },
      });
      if (roomIsExist) {
        const inputRoom = {
          player_two_id: decode.username,
        };
        const resultRoom = await Room.create(inputRoom);
        const roomName = resultRoom.name_room;
        const roomId = resultRoom.id;
        res.json({
          login: true,
          data: decode,
          message: "Berhasil join room",
          room_name: roomName,
          room_id: roomId,
        });
        console.log(resultRoom);
        return;
      } else {
        const inputRoom = {
          name_room,
          player_one_id: decode.username,
        };
        const resultRoom = await Room.create(inputRoom);
        const roomName = resultRoom.name_room;
        const roomId = resultRoom.id;
        res.json({
          login: true,
          data: decode,
          message: "Room berhasil dibuat",
          room_name: roomName,
          room_id: roomId,
        });
        console.log(resultRoom);
      }
    } else if (!token) {
      console.log(
        res.json({
          login: false,
          message: "Silahkan login terlebih dahulu!",
        })
      );
      res.redirect("/login");
    }
  }
}

module.exports = UserController;
