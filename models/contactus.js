const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  fullname: { type: String, required: true },
  EmailAddress: { type: String, required: true },
  Subject: { type: String, required: true },
  Message: { type: String, required: true }
});

module.exports = mongoose.model('Contact', contactSchema);
