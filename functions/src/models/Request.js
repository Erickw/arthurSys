/* eslint-disable require-jsdoc */
class Request {
  constructor(payload) {
    this.id = payload.id;
    this.userId = payload.userId;
    this.productId = payload.productId || "";
    this.patientName = payload.patientName || "";
    this.patientEmail = payload.patientEmail || "";
    this.status = payload.status || "";
    this.date = payload.date || "";
    this.address = payload.address || "";
    this.bankInfo = payload.bankInfo || "";
  }

  requestInfo() {
    return {
      id: this.id,
      userId: this.userId,
      productId: this.productId,
      patientName: this.patientName,
      patientEmail: this.patientEmail,
      status: this.status,
      date: this.date,
      address: this.address,
      bankInfo: this.bankInfo,
    };
  }
}

module.exports = Request;
