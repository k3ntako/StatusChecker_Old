const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Email {
  constructor(subject, body) {
    this.subject = subject;
    this.body = body;
  }

  composeMessage() {
    const recipients = process.env.recipients.split(",");

    const defaultParams = {
      to: recipients,
      from: process.env.sender,
      subject: `[URGENT] ${this.subject}`,
      text: this.body,
      html: this.body.split("\n").join("<br/>").split(" ").join("&nbsp;"),
    };

    return Object.assign(defaultParams, this.messageParams);
  }

  async sendErrorEmail() {
    try {
      const message = this.composeMessage();

      await sgMail.send(message);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
};
