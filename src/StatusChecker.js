const fetch = require("node-fetch");
const Email = require("./Email");

module.exports = class StatusChecker {
  constructor(logger) {
    this.logger = logger;
  }

  async start() {
    this.checkStatus();
  }

  async checkStatus() {
    try {
      const response = await this.pingServer();

      if (!response || response.isServerConnected !== true) {
        throw new Error("Invalid response");
      }

      this.handleSuccess(response);
    } catch (err) {
      await this.handleError(err);
    }
  }

  async pingServer() {
    const response = await fetch(process.env.url);

    return await response.json();
  }

  async handleSuccess(response) {
    this.logger.log(`Response body: ${JSON.stringify(response)}`);
  }

  async handleError(err) {
    const email = new Email(err);
    await email.sendErrorEmail();
  }
};
