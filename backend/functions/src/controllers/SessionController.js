/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const usersCollection = db.collection("users");
const jwt = require("jsonwebtoken");

const authConfig = require("../../config/auth");
const User = require("../models/User");

class SessionController {
  async store(req, res) {
    const {email} = req.body;

    const snapshot = await usersCollection.where("email", "==", email ).get();

    if (snapshot.empty) {
      return res.status(400).json(
          {error: "Error to get user info. No matching documents."});
    }

    snapshot.forEach((doc) => {
      const {id, email, name, admin} = new User(doc.data()).userInfo();
      return res.json({
        user: {
          id,
          email,
          name,
          admin,
        },
        token: jwt.sign({id}, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    });
  }
}

module.exports = new SessionController( );
