const express = require('express');
const Contact = require('../models/Contact');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/contacts — public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, countryCode, market, message } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
    const contact = await Contact.create({ name, email, phone, countryCode, market, message });
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contacts — admin
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contacts/:id/read — admin
router.put('/:id/read', auth, requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/contacts/:id — admin
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
