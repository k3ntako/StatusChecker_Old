const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports = class Logger {
  constructor(rootPath) {
    this.rootPath = rootPath;
  }

  log(message) {
    let text, stack;
    if (message instanceof Error) {
      text = message;
      stack = message.stack;
    } else {
      text = message;
      stack = null;
    }

    const momentDate = moment().tz("America/New_York");
    const paths = this.generateLogPath(momentDate);

    const [logDirectoryPath, logFilePath] = paths;

    this.createLogDirectory(logDirectoryPath);
    this.write(logFilePath, momentDate, text, stack);
  }

  generateLogPath(momentDate) {
    const date = momentDate.date();
    const month = momentDate.month() + 1; // month is 0 to 11
    const year = momentDate.year();

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

  write(logFilePath, momentDate, text, stack) {
    const fd = fs.openSync(logFilePath, "as"); // append synchronously (create if does not exist)

    const dateStr = momentDate.format("YYYY-MM-D hh:mm:ss.SSS A zz");

    let logText = `${dateStr} - ${text}`;
    if (stack) {
      logText += `\n ${stack}`;
    }

    console.log(logText);
    fs.writeSync(fd, logText + "\n");
  }
};
