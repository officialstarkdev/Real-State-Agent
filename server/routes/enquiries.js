const express = require('express');
const Enquiry = require('../models/Enquiry');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/enquiries — public
router.post('/', async (req, res) => {
  try {
    const { name, email, message, property, propertyTitle } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
    const enquiry = await Enquiry.create({ name, email, message, property, propertyTitle });
    res.status(201).json({ message: 'Enquiry sent successfully', enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/enquiries — admin
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).populate('property', 'title slug');
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/enquiries/:id/read — admin
router.put('/:id/read', auth, requireAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
