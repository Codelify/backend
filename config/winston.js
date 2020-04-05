const appRoot = require('app-root-path');
const winston = require('winston');

// define the custom settings for each transport (file, console)
const options = {
  error: {
    level: 'error',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  debug: {
    level: 'debug',
    filename: `${appRoot}/logs/app.debug`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.error),
    new winston.transports.File(options.debug),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: (message, encoding) => {
    // use the 'info' log level so the output will be picked up
    // by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
