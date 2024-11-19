"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  login: async (req, res) => {
    const { userName, password, email } = req.body;

    if (!(email || userName) && password) {
      res.errorStatusCode = 401;
      throw new Error("UserName/Email and Password required!");
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (user?.password !== passwordEncrypt(password)) {
      res.errorStatusCode = 401;
      throw new Error("Invalid Credentials!");
    }

    if (!user.isActive) {
      res.errorStatusCode = 401;
      throw new Error("Your account is not active!");
    }

    let tokenData = await Token.findOne({ userId: user._id });

    if (!tokenData) {
      tokenData = await Token.create({
        userId: user._id,
        token: passwordEncrypt(user._id + Date.now()),
      });
    }
    res.status(201).send({
      error: false,
      token: tokenData.token,
      user,
    });
  },

  logout: async (req, res) => {},
};
