/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const requestsCollection = db.collection("requests");
const customId = require("custom-id");

const Request = require("../models/Request");

class RequestController {
  async index(req, res) {
    const snapshot = await requestsCollection.get();
    const requests = [];
    if (snapshot.empty) {
      return res.status(400).json({error: "Error to get request. No matching documents."});
    }
    snapshot.forEach((doc) => {
      requests.push(new Request(doc.data()).requestInfo());
    });
    return res.json(requests);
  }

  async store(req, res) {
    const request = req.body;
    const id = customId({});
    request.id = id;
    await requestsCollection.doc(id).set(new Request(request).requestInfo()).catch((e) => console.log("Error: ", e.message));
    return res.json({message: `Request add on database with success, ${request.id}`});
  }

  async update(req, res) {
    const id = req.params.id;
    const snapshot = await requestsCollection.where("id", "==", id ).get();

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to update request. No matching documents."});
    }

    await requestsCollection.doc(id).set(req.body).catch((e) => console.log("Error: ", e.message));
    return res.json({message: "Request updated with success:"});
  }

  async delete(req, res) {
    const id = req.params.id;
    const snapshot = await requestsCollection.where("id", "==", id ).get();

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to delete request. No matching documents."});
    }

    snapshot.forEach((doc) => {
      doc.ref.delete();
    });
    res.json({message: "Request deleted with success"});
  }
}

module.exports = new RequestController();
