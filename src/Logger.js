const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports = class Logger {
  constructor(rootPath) {
    this.rootPath = rootPath;
  }

  log(text) {
    const dateObj = new Date();
    const paths = this.generateLogPath(dateObj);

    const [logDirectoryPath, logFilePath] = paths;

    this.createLogDirectory(logDirectoryPath);
    // this.grantWritePermission(logFilePath);

    this.write(logFilePath, dateObj, text);
  }

  generateLogPath(dateObj) {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // month is 0 to 11
    const year = dateObj.getFullYear();

    const logDirectoryPath = path.resolve(
      this.rootPath,
      `logs/${year}_${month}`
    );
    const logFilePath = logDirectoryPath + `/${date}.log`;
    return [logDirectoryPath, logFilePath];
  }

  createLogDirectory(logDirectoryPath) {
    if (!fs.existsSync(logDirectoryPath)) {
      fs.mkdirSync(logDirectoryPath, { recursive: true });
    }
  }

  grantWritePermission(logFilePath) {
    fs.chmodSync(logFilePath, 0o777);
  }

  write(logFilePath, dateObj, text) {
    const fd = fs.openSync(logFilePath, "as"); // append synchronously (create if does not exist)

    const dateStr = moment(dateObj)
      .tz("America/New_York")
      .format("YYYY-MM-D hh:mm:ss.SSS A");

    const logText = `${dateStr} - ${text}`;

    console.log(logText);
    fs.writeSync(fd, logText + "\n");
  }
};
