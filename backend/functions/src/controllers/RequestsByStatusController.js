/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const requestsCollection = db.collection("requests");

const Request = require("../models/Request");

class RequestsByStatus {
  async index(req, res) {
    const {userId, status} = req.params;
    const snapshot = await requestsCollection.where("userId", "==", userId).where("status", "==", status).get();
    const requests = [];

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to get request. No matching documents."});
    }

    snapshot.forEach((doc) => {
      requests.push(new Request(doc.data()).requestInfo());
    });

    return res.json(requests);
  }
}

module.exports = new RequestsByStatus();
