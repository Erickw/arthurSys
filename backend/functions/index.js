const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const app = require("express")();
const routes = require("./routes");

const userController = require("./src/controllers/UserController");

app.use(routes);

// Auth Triggers
exports.insertNewUser = functions.auth.user().onCreate((user) => {
  userController.createDbUser(user);
});

exports.api = functions.https.onRequest(app);
