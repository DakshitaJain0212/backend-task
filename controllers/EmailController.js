const emailService = require('../services/EmailService');

exports.sendEmail = async (req, res) => {
  const { to, subject, text, emailId } = req.body;

  try {
    const result = await emailService.sendEmail(to, subject, text, emailId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
