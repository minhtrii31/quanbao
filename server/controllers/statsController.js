const News = require('../models/News');
const Project = require('../models/Project');
const Contact = require('../models/Contact');

// Get dashboard statistics (admin)
exports.getStats = async (req, res) => {
  try {
    const [newsCount, projectCount, newContacts] = await Promise.all([
      News.countDocuments({ status: 'published' }),
      Project.countDocuments({ status: 'published' }),
      Contact.countDocuments({ status: 'new' })
    ]);

    res.json({
      success: true,
      news: newsCount,
      projects: projectCount,
      contacts: newContacts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};