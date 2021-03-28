const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const app = require("express")();
const cors = require("cors");
const routes = require("./routes");

app.use(cors());
app.options("*", cors());
app.use(routes);

exports.api = functions.https.onRequest(app);
