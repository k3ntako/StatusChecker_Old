const fs = require("fs");

module.exports = class Logger {
  log(text) {
    const dateObj = new Date();
    const paths = this.generateLogPath(dateObj);

    const [logDirectoryPath, logFilePath] = paths;

    this.createLogDirectory(logDirectoryPath);
    this.write(logFilePath, dateObj, text);
  }

  generateLogPath(dateObj) {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // month is 0 to 11
    const year = dateObj.getFullYear();

    const logDirectoryPath = `../logs/${year}_${month}`;
    const logFilePath = logDirectoryPath + `/${date}.log`;
    return [logDirectoryPath, logFilePath];
  }

  createLogDirectory(logDirectoryPath) {
    if (!fs.existsSync(logDirectoryPath)) {
      fs.mkdirSync(logDirectoryPath, { recursive: true });
    }
  }

  write(logFilePath, dateObj, text) {
    const fd = fs.openSync(logFilePath, "a"); // append (create if does not exist)
    fs.writeSync(fd, `${dateObj.toString()} - ${text}\n`);
  }
};
