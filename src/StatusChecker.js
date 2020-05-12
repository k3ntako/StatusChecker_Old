const fetch = require("node-fetch");
const Email = require("./Email");

module.exports = class StatusChecker {
  constructor(logger) {
    this.logger = logger;
  }

  async start() {
    await this.checkStatus();
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
    let timeout;
    const promise = new Promise((resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error("Fetch timed out after 5 seconds")),
        5000
      );

      return fetch(process.env.url).then(resolve, reject);
    });

    const response = await promise;

    clearTimeout(timeout);

    return await response.json();
  }

  async handleSuccess(response) {
    this.logger.log(`Response body: ${JSON.stringify(response)}`);
  }

  async handleError(err) {
    this.logger.log(`Error: ${err.message}`);

    const email = new Email(err);
    await email.sendErrorEmail();
  }
};
