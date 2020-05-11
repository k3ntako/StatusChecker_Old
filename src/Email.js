const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Email {
  constructor(err) {
    this.err = err;
  }

  composeMessage() {
    const errMessage = this.err.message;
    const recipients = process.env.recipients.split(",");

    return {
      to: recipients,
      from: process.env.sender,
      subject: "[URGENT] Error with server",
      text: errMessage,
      html: `<strong>${errMessage}</strong>`,
    };
  }

  async sendErrorEmail() {
    const message = this.composeMessage();

    try {
      await sgMail.send(message);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
};
