const fetch = require("node-fetch");
const Email = require("./Email");

module.exports = class ErrorHandler {
  constructor(logger) {
    this.logger = logger;
  }

  async handleError(err) {
    await this.sendEmail(err.message, err.stack);
  }

  async handleErrorWithResponse(response, body) {
    const subject = `Wakebird.com - Status ${response.status}`;

    const responseJSON = {
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      body: body,
      url: response.url,
      redirected: response.redirected,
      useFinalURL: response.useFinalURL,
    };

    const headers = {};
    for (const pair of response.headers.entries()) {
      headers[pair[0]] = pair[1];
    }
    responseJSON.headers = headers;

    const bodyText = JSON.stringify(responseJSON, null, 2);

    await this.sendEmail(subject, bodyText);
  }

  async sendEmail(subject, body) {
    try {
      this.logger.log(`Error: ${subject}\n${body}`);

      const email = new Email(subject, body);
      await email.sendErrorEmail();
    } catch (error) {
      this.logger.log(error);
    }
  }
};
