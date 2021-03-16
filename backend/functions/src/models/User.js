/* eslint-disable require-jsdoc */
class User {
  constructor(payload) {
    this.id = payload.id;
    this.name = payload.name || "";
    this.email = payload.email || "";
    this.senha = payload.senha || "";
    this.idAvatar = payload.idAvatar || "";
    this.admin = payload.admin || "";
  }

  userInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.idAvatar,
      admin: this.admin,
    };
  }
}

module.exports = User;
