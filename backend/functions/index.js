const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const app = require("express")();
const routes = require("./routes");

app.use(routes);

exports.api = functions.https.onRequest(app);
