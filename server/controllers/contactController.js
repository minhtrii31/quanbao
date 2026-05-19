const Contact = require('../models/Contact');
const mongoose = require('mongoose');
const { buildSearchQuery, buildSort, formatPagination, parsePagination } = require('../utils/adminListQuery');
const {
  contactStatuses,
  validateContactCreatePayload,
  validateContactUpdatePayload,
} = require('../validation/cmsSchemas');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Submit contact form
exports.submitContact = async (req, res) => {
  const validation = validateContactCreatePayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }
  try {
    const contact = new Contact(validation.payload);
    await contact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all contacts (admin)
exports.getContacts = async (req, res) => {
  try {
    const { status } = req.query;
    const { page, limit, skip } = parsePagination(req.query, { limit: 10 });

    let query = {
      ...buildSearchQuery(req.query.search, ['name', 'email', 'phone', 'subject', 'message']),
    };
    if (status) {
      if (!contactStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid contact status' });
      }
      query.status = status;
    }

    const sort = buildSort(req.query, ['name', 'email', 'subject', 'status', 'createdAt'], { createdAt: -1 });
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort(sort).skip(skip).limit(limit),
      Contact.countDocuments(query),
    ]);

    res.json({ success: true, contacts, ...formatPagination({ page, limit, total }) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update contact status (admin)
exports.updateContact = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid contact id' });
  }

  const validation = validateContactUpdatePayload(req.body, { partial: true });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, validation.payload, { new: true, runValidators: true });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete contact (admin)
exports.deleteContact = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid contact id' });
  }

  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
