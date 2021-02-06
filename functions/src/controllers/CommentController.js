/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const requestsCollection = db.collection("requests");
const customId = require("custom-id");

const Comment = require("../models/Comment");

class CommentController {
  async index(req, res) {
    const requestId = req.params.id;
    const commentsCollection = db.collection(`requests/${requestId}/comments`);
    const snapshot = await commentsCollection.get();
    const comments = [];
    if (snapshot.empty) {
      return res.status(400).json({error: "Error to get comment. No matching documents."});
    }
    snapshot.forEach((doc) => {
      comments.push(new Comment(doc.data()).commentInfo());
    });
    return res.json(comments);
  }

  async store(req, res) {
    const comment = req.body;
    const requestId = req.params.id;
    const id = customId({});

    const requestSnapshot = db.collection(`requests/${requestId}/comments`);
    comment.id = id;
    await requestSnapshot.doc(id).set(new Comment(comment).commentInfo()).catch((e) => console.log("Error: ", e.message));
    return res.json({message: `Comment add on database with success, ${comment.id}`});
  }


  async delete(req, res) {
    const {requestId, commentId} = req.body;
    const commentsSnapshot = await db.collection(`requests/${requestId}/comments`).where("id", "==", commentId ).get();

    if (commentsSnapshot.empty) {
      return res.status(400).json({error: "Error to delete comment. No matching documents."});
    }

    commentsSnapshot.forEach((doc) => {
      doc.ref.delete();
    });
    res.json({message: "Comment deleted with success"});
  }
}

module.exports = new CommentController();
