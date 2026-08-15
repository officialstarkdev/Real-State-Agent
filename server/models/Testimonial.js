const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  initials: { type: String, required: true },
  flag: { type: String, default: '' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  quote: { type: String, required: true },
  subtitle: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
