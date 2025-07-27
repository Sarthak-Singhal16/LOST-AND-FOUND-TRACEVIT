const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  place: { type: String, required: true },
  status: { type: String },
  image: { type: String },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
