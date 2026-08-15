const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  flag: { type: String, default: '' },
  market: { type: String, required: true },
  loc: { type: String, required: true },
  price: { type: String, required: true },
  priceNumeric: { type: Number, default: 0 },
  status: { type: String, enum: ['For Sale', 'For Rent', 'Sold'], default: 'For Sale' },
  type: { type: String, required: true },
  beds: { type: Number, default: 0 },
  baths: { type: Number, default: 0 },
  garage: { type: Number, default: 0 },
  area: { type: String, default: '' },
  land: { type: String, default: '—' },
  year: { type: Number, default: new Date().getFullYear() },
  images: [{ type: String }],
  desc: [{ type: String }],
  features: [{ type: String }],
  details: { type: Map, of: String },
  mapTitle: { type: String, default: '' },
  mapNote: { type: String, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

propertySchema.index({ market: 1, type: 1, status: 1 });
propertySchema.index({ slug: 1 });

module.exports = mongoose.model('Property', propertySchema);
