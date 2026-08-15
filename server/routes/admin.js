const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Enquiry = require('../models/Enquiry');
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const [properties, users, contacts, enquiries, testimonials, services, unreadContacts, unreadEnquiries] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments(),
      Contact.countDocuments(),
      Enquiry.countDocuments(),
      Testimonial.countDocuments(),
      Service.countDocuments(),
      Contact.countDocuments({ read: false }),
      Enquiry.countDocuments({ read: false }),
    ]);
    res.json({ properties, users, contacts, enquiries, testimonials, services, unreadContacts, unreadEnquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
