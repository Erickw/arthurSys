/* eslint-disable require-jsdoc */
class Comment {
  constructor(payload) {
    this.id = payload.id;
    this.authorId = payload.authorId || "";
    this.content = payload.content || "";
    this.senha = payload.senha || "";
    this.idAvatar = payload.idAvatar || "";
    this.admin = payload.admin || "";
  }

  commentInfo() {
    return {
      id: this.id,
      authorId: this.authorId,
      content: this.content,
    };
  }
}

module.exports = Comment;
