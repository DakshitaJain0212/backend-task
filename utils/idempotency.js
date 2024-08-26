const sentEmails = new Set();

function isDuplicate(emailId) {
  return sentEmails.has(emailId);
}

function markAsSent(emailId) {
  sentEmails.add(emailId);
}

module.exports = { isDuplicate, markAsSent };
