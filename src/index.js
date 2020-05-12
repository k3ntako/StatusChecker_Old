const path = require("path");
const rootPath = path.resolve(path.dirname(require.main.filename), "../");
const envPath = path.resolve(rootPath, ".env");

require("dotenv").config({ path: envPath });

(async () => {
  const Logger = require("./Logger");
  const StatusChecker = require("./StatusChecker");

  const logger = new Logger(rootPath);
  logger.log("Starting StatusChecker...");

  const statusChecker = new StatusChecker(logger);
  await statusChecker.start();

  logger.log("Finished StatusChecker");
})();
