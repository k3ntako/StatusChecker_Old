const fs = require("fs");

module.exports = class Logger {
  log(text) {
    const dateObj = new Date();
    const paths = this.generateLogPath(dateObj);

    const [logDirectoryPath, logFilePath] = paths;

    this.createLogDirectory(logDirectoryPath);
    this.grantWritePermission(logFilePath);
    this.write(logFilePath, dateObj, text);
  }

  generateLogPath(dateObj) {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // month is 0 to 11
    const year = dateObj.getFullYear();

    const logDirectoryPath = `/srv/StatusChecker/logs/${year}_${month}`;
    const logFilePath = logDirectoryPath + `/${date}.log`;
    return [logDirectoryPath, logFilePath];
  }

  createLogDirectory(logDirectoryPath) {
    if (!fs.existsSync(logDirectoryPath)) {
      console.log('attempt to make' + logDirectoryPath);
      fs.mkdirSync(logDirectoryPath, { recursive: true });
    }
  }
  
  grantWritePermission(logFilePath){
    fs.chmodSync(logFilePath, 0o777);
  }

  write(logFilePath, dateObj, text) {
    const fd = fs.openSync(logFilePath, "a"); // append (create if does not exist)
    const dateStr = dateObj.toLocaleString('en-US', { timeZone: "America/New_York"}); 
    const isoStr = new Date(dateStr).toISOString().slice(0, -5);

    fs.writeSync(fd, `EST ${isoStr} - ${text}\n`);
  }
};
