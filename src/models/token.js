"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { Schema, model } = require("mongoose");

/* ------------------------------------------------------- */
// Token Model:

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    token: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
  },
  { collection: "tokens", timestamps: true }
);

/* ------------------------------------------------------- */

module.exports = model("Token", TokenSchema);
