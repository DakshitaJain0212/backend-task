const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = {
  emailProviders: [
    {
      name: "Provider1",
      transporter: nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "mockprovider01@gmail.com",
          pass: process.env.MOCK_PROVIDER01,
        },
      }),
      maxRetries: 3,
    },
    {
      name: "Provider2",
      transporter: nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "mockprovider02@gmail.com",
          pass: process.env.MOCK_PROVIDER02,
        },
      }),
      maxRetries: 3,
    },
  ],
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};
