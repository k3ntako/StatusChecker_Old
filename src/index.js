require("dotenv").config({ path: "/srv/StatusChecker/.env"  });

const Logger = require("./Logger");
const StatusChecker = require("./StatusChecker");

console.log("Starting StatusChecker...");

const logger = new Logger();
const statusChecker = new StatusChecker(logger);
statusChecker.start();
