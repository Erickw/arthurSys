/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const firebaseConfig = require("../../config/firebase");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const admin = require("firebase-admin");
const db = admin.firestore();
const auth = firebase.auth();
const usersCollection = db.collection("users");

const customId = require("custom-id");
admin.firestore().settings({ignoreUndefinedProperties: true});

const User = require("../models/User");

class UserController {
  async index(req, res) {
    const snapshot = await usersCollection.get();
    const users = [];
    if (snapshot.empty) {
      return res.status(400).json({error: "Error to get user. No matching documents."});
    }
    snapshot.forEach((doc) => {
      users.push(new User(doc.data()).userInfo());
    });
    return res.json(users);
  }

  async getOneUser(req, res) {
    const id = req.params.id;
    const snapshot = await usersCollection.doc(id).get();


    if (snapshot.empty) {
      return res.status(400).json({error: "Error to get user. No matching documents."});
    }

    return res.json(new User(snapshot.data()).userInfo());
  }

  // async createDbUser(user) {
  //   const id = customId({email: user.email});
  //   user.id = id;
  //   await usersCollection.doc(id).set(new User(user).userInfo()).catch((e) => console.log("Error: ", e.message));
  //   console.log("User add on database with success", user.email);
  // }

  async store(req, res) {
    const {email, password} = req.body;
    const id = customId({});
    req.body.id = id;

    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      return res.status(406).json({error: error.message});
    }

    await usersCollection.doc(id).set(new User(req.body).userInfo()).catch((e) => console.log("Error: ", e.message));
    return res.json({message: `User add on database with success, ${email}`});
  }

  async update(req, res) {
    const id = req.params.id;
    const {email, password, newPassword} = req.body;
    const snapshot = await usersCollection.doc(id).get();

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to update user. No matching documents."});
    }

    try {
      if (newPassword) {
        await auth.signInWithEmailAndPassword(email, password);
        const loggedUser = firebase.auth().currentUser;
        await loggedUser.updatePassword(newPassword);
      }
    } catch (error) {
      return res.status(406).json({error: error.message});
    }

    await usersCollection.doc(id).set(req.body).catch((e) => console.log("Error: ", e.message));
    return res.json({message: "User updated with success:"});
  }

  async delete(req, res) {
    const id = req.params.id;
    const snapshot = await usersCollection.doc(id).delete();

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to delete user. No matching documents."});
    }

    res.json({message: "User deleted with success"});
  }
}

module.exports = new UserController();
