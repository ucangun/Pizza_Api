"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const { Schema, model } = require("mongoose");

/* ------------------------------------------------------- */

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      set: (password) => passwordEncrypt(password),
      //   validate: (password) => true,  ==> in Controller
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: [
        (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
        "Please fill a valid email address",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "users" }
);

module.exports = model("User", userSchema);
