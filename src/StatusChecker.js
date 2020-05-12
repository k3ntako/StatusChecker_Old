const fetch = require("node-fetch");
const Email = require("./Email");

module.exports = class StatusChecker {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  async start() {
    await this.checkStatus();
  }

  async checkStatus() {
    try {
      const response = await this.pingServer();

      if (!response) {
        return await this.errorHandler.handleError(
          new Error("Received no response")
        );
      }

      const body = await this.parseBody(response);

      if (response.status !== 200 || !body || body.isServerConnected !== true) {
        return await this.errorHandler.handleErrorWithResponse(response, body);
      }

      this.handleSuccess(body);
    } catch (err) {
      await this.errorHandler.handleError(err);
    }
  }

  async parseBody(response) {
    try {
      const body = await response.json();
      return body;
    } catch (error) {
      this.logger.log(error);
    }

    return null;
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

    clearTimeout(timeout);

    return await promise;
  }

  async handleSuccess(response) {
    this.logger.log(`Response body: ${JSON.stringify(response)}`);
  }
};
