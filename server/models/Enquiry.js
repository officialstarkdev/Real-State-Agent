const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, default: '' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  propertyTitle: { type: String, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
