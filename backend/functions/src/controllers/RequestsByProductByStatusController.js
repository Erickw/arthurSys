/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const requestsCollection = db.collection("requests");

const Request = require("../models/Request");

class RequestsByProductByStatusController {
  async index(req, res) {
    const productId = req.query.productId;
    const status = req.query.status;
    const snapshot = await requestsCollection.where("productId", "==", productId).where("status", "==", status).get();
    const requests = [];

    console.log("teste");

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    snapshot.forEach((doc) => {
      requests.push(new Request(doc.data()).requestInfo());
    });

    return res.json(requests);
  }
}

module.exports = new RequestsByProductByStatusController();
