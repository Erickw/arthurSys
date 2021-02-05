/* eslint-disable require-jsdoc */
class Product {
  constructor(payload) {
    this.id = payload.id;
    this.name = payload.name || "";
    this.description = payload.description || "";
    this.value = payload.value || "";
    this.requiredPayment = payload.requiredPayment || "";
    this.notes = payload.notes || "";
    this.available = payload.available || "";
    this.fields = payload.fields || "";
  }

  productInfo() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      value: this.value,
      requiredPayment: this.requiredPayment,
      notes: this.notes,
      available: this.available,
      fields: this.fields,
    };
  }
}

module.exports = Product;
