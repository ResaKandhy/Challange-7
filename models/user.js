// models/user.js
"use strict";
const { Model } = require("sequelize");
/* Pertama, kita import bcrypt untuk melakukan enkripsi */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    // Method untuk melakukan enkripsi
    static #encrypt = (password) => bcrypt.hashSync(password, 10);

    // Lalu, kita buat method register
    static register = ({ username, password }) => {
      const encryptedPassword = this.#encrypt(password);
      /*
#encrypt dari static method
encryptedPassword akan sama dengan string
hasil enkripsi password dari method #encrypt
*/
      return this.create({ username, password: encryptedPassword });
    };

    generateToken = () => {
      // Jangan memasukkan password ke dalam payload
      const payload = {
        id: this.id,
        username: this.username,
      };
      // Rahasia ini nantinya kita pakai untuk memverifikasi apakah token ini benar-benar berasal dari aplikasi kita
      const rahasia = "Ini rahasia ga boleh disebar-sebar";
      // Membuat token dari data-data diatas
      const token = jwt.sign(payload, rahasia);
      return token;
    };

    checkPassword = (password) => bcrypt.compareSync(password, this.password);

    /* Method Authenticate, untuk login */
    static authenticate = async ({ username, password }) => {
      try {
        const user = await this.findOne({ where: { username } });
        if (!user) return Promise.reject("User not found!");
        const isPasswordValid = user.checkPassword(password);
        if (!isPasswordValid) return Promise.reject("Wrong password");
        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }

  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
