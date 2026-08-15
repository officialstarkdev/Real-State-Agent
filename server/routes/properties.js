const express = require('express');
const Property = require('../models/Property');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/properties — list all with filters
router.get('/', async (req, res) => {
  try {
    const { market, type, status, search, featured, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (market) filter.market = { $regex: market, $options: 'i' };
    if (type) filter.type = { $regex: type, $options: 'i' };
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { loc: { $regex: search, $options: 'i' } },
        { market: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.priceNumeric = {};
      if (minPrice) filter.priceNumeric.$gte = Number(minPrice);
      if (maxPrice) filter.priceNumeric.$lte = Number(maxPrice);
    }

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/properties/featured
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/properties/:slug
router.get('/:slug', async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/properties — admin only
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/properties/:id — admin only
router.put('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/properties/:id — admin only
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
