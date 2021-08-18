/* eslint-disable require-jsdoc */
class User {
  constructor(payload) {
    this.id = payload.id;
    this.name = payload.name || "";
    this.email = payload.email || "";
    this.senha = payload.senha || "";
    this.idAvatar = payload.idAvatar || "";
    this.type = payload.type || "";
    this.city = payload.city || "";
    this.state = payload.state || "";
    this.neighborhood = payload.neighborhood || "";
    this.street = payload.street || "";
    this.zipCode = payload.zipCode || "";
    this.number = payload.number || "";
    this.contactNumber = payload.contactNumber || "";
  }

  userInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.idAvatar,
      type: this.type,
      city: this.city,
      state: this.state,
      neighborhood: this.neighborhood,
      street: this.street,
      zipCode: this.zipCode,
      number: this.number,
      contactNumber: this.contactNumber,
    };
  }
}

module.exports = User;
