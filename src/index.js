const path = require("path");
const rootPath = path.resolve(path.dirname(require.main.filename), "../");
const envPath = path.resolve(rootPath, ".env");

require("dotenv").config({ path: envPath });

const Logger = require("./Logger");
const StatusChecker = require("./StatusChecker");
const ErrorHandler = require("./ErrorHandler");

(async () => {
  const logger = new Logger(rootPath);

  try {
    logger.log("Starting StatusChecker...");

    const errorHandler = new ErrorHandler(logger);
    const statusChecker = new StatusChecker(logger, errorHandler);
    await statusChecker.start();
  } catch (error) {
    logger.log(error);

    const email = new Email(error.message, error.stack);
    await email.sendErrorEmail();
  } finally {
    logger.log("Finished StatusChecker");
  }
})();
