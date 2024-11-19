"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const passwordEncrypt = require("../helpers/passwordEncrypt");
const User = require("../models/user");
const Token = require("../models/token");

module.exports = {
  /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
   */

  login: async (req, res) => {
    const { userName, password, email } = req.body;

    if (!((userName || email) && password)) {
      res.errorStatusCode = 401;
      throw new Error("UserName/Email and Password required!");
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (!user || user?.password !== passwordEncrypt(password)) {
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

  logout: async (req, res) => {
    /*
        #swagger.tags = ["Tokens"]
        #swagger.summary = "Create Token"
    */

    const auth = req.headers?.authorization; //"Token fgdgfhg623gjhbksj"
    const tokenKey = auth ? auth.split(" ") : null; // [ "Token", tokenKey]
    const result = await Token.deleteOne({ token: tokenKey[1] });

    res.status(200).send({
      error: false,
      message: "Token deleted.",
      result,
    });
  },
};
