/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");

const firebaseConfig = require("../../config/firebase");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const User = require("../models/User");

const db = admin.firestore();
const usersCollection = db.collection("users");

class SessionController {
  async store(req, res) {
    const {email, password} = req.body;
    const user = await auth.signInWithEmailAndPassword(email, password)
        .catch((e) => console.log("Error: ", e.message));

    if (!user) {
      return res.status(401).json({
        error: "Not authorized, check your email or password"});
    }

    const snapshot = await usersCollection.where("email", "==", email).get();

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
