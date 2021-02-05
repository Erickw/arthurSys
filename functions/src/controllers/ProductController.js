/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const productsCollection = db.collection("products");
const customId = require("custom-id");

const Product = require("../models/Product");

class ProductController {
  async index(req, res) {
    const snapshot = await productsCollection.get();
    const products = [];
    if (snapshot.empty) {
      return res.status(400).json({error: "Error to get product. No matching documents."});
    }
    snapshot.forEach((doc) => {
      products.push(new Product(doc.data()).productInfo());
    });
    return res.json(products);
  }

  async getOne(req, res) {
    const id = req.params.id;
    const snapshot = await productsCollection.where("id", "==", id ).get();

    const productsSnapshot = await db.collection(`users/${id}/products`).get();

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to get user. No matching documents."});
    }

    productsSnapshot.forEach((doc) => {
      return res.json({"user": "rr"});
    });
  }

  async store(req, res) {
    const product = req.body;
    const id = customId({});
    product.id = id;
    await productsCollection.doc(id).set(new Product(product).productInfo()).catch((e) => console.log("Error: ", e.message));
    return res.json({message: `Product add on database with success, ${product.id}`});
  }

  async update(req, res) {
    const id = req.params.id;
    const snapshot = await productsCollection.where("id", "==", id ).get();

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to update product. No matching documents."});
    }

    await productsCollection.doc(id).set(req.body).catch((e) => console.log("Error: ", e.message));
    return res.json({message: "Product updated with success:"});
  }

  async delete(req, res) {
    const id = req.params.id;
    const snapshot = await productsCollection.where("id", "==", id ).get();

    if (snapshot.empty) {
      return res.status(400).json({error: "Error to delete product. No matching documents."});
    }

    snapshot.forEach((doc) => {
      doc.ref.delete();
    });
    res.json({message: "Product deleted with success"});
  }
}

module.exports = new ProductController();
