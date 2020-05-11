require("dotenv").config({ path: "../.env" });

const Logger = require("./Logger");
const StatusChecker = require("./StatusChecker");

const logger = new Logger();
const statusChecker = new StatusChecker(logger);
statusChecker.start();
