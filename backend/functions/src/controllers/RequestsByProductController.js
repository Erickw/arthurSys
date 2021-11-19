/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const requestsCollection = db.collection("requests");

const Request = require("../models/Request");

class RequestsByProduct {
  async index(req, res) {
    const {userId, productName} = req.params;
    const snapshot = await requestsCollection.where("userId", "==", userId).where("productName", "==", productName).get();
    const requests = [];

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    snapshot.forEach((doc) => {
      requests.push(new Request(doc.data()).requestInfo());
    });

    return res.json(requests);
  }
}

module.exports = new RequestsByProduct();
