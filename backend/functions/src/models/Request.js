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
    this.userName = payload.userName || "";
    this.accepted = payload.accepted || "";
    this.fieldsValues = payload.fieldsValues || "";
    this.productPropose = payload.productPropose || "";
    this.additionalFields = payload.additionalFields || "";
    this.hasNewCommentAdmin = payload.hasNewCommentAdmin || "";
    this.hasNewCommentUser = payload.hasNewCommentUser || "";
    this.responsible = payload.responsible || "";
    this.productName = payload.productName || "";
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
      userName: this.userName,
      accepted: this.accepted,
      fieldsValues: this.fieldsValues,
      productPropose: this.productPropose,
      additionalFields: this.additionalFields,
      hasNewCommentAdmin: this.hasNewCommentAdmin,
      hasNewCommentUser: this.hasNewCommentUser,
      responsible: this.responsible,
      productName: this.productName,
    };
  }
}

module.exports = Request;

