
const nodemailer = require("nodemailer");
const { emailProviders } = require("../config/config");
const { isDuplicate, markAsSent } = require("../utils/idempotency");
const CircuitBreaker = require("../utils/circuitBreaker");
const { logInfo, logError } = require("../utils/logger");

class EmailService {
  constructor() {
    this.providers = emailProviders;
    this.currentProviderIndex = 0;
    this.circuitBreaker = new CircuitBreaker();
  }

  async sendEmail(to, subject, text, emailId) {
    if (isDuplicate(emailId)) {
      logInfo(`Email with ID ${emailId} is a duplicate.`);
      throw new Error("Duplicate email detected.");
    }

    if (this.circuitBreaker.isOpen()) {
      logError("Circuit breaker is open.");
      throw new Error("Circuit breaker is open.");
    }

    const provider = this.providers[this.currentProviderIndex];
    const transporter = provider.transporter;
    const maxRetries = provider.maxRetries;
    let attempt = 0;
    let lastError;

    while (attempt < maxRetries) {
      try {
        const info = await transporter.sendMail({
          from: '"Email Service" <example@example.com>',
          to,
          subject,
          text,
        });

        markAsSent(emailId);
        this.circuitBreaker.succeed();
        logInfo(`Email sent successfully with ID ${emailId}`);
        return { success: true, info };
      } catch (error) {
        lastError = error;
        attempt++;
        this.circuitBreaker.fail();
        logError(`Attempt ${attempt} failed for email ID ${emailId}: ${error.message}`);

        if (attempt >= maxRetries) {
          this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
          if (this.currentProviderIndex === 0) {
            logError(`All providers failed for email ID ${emailId}`);
            throw new Error("All providers failed.");
          }
        }
      }
    }
  }
}

module.exports = new EmailService();
