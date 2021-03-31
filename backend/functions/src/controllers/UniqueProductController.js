/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const productsCollection = db.collection("products");

const Product = require("../models/Product");

class UniqueProduct {
  async index(req, res) {
    const id = req.params.id;
    const product = await productsCollection.doc(id).get();

    if (!product.exists) {
      return res.status(400).json({error: "Error to get product. No matching documents."});
    }

    return res.json(new Product(product.data()).productInfo());
  }
}

module.exports = new UniqueProduct();
