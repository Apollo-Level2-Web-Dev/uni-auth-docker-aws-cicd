// import path from 'path';
// import winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
//   transports: [
//     new DailyRotateFile({
//       filename: path.join(process.cwd(), 'logs', 'winston', 'success', 'success-%DATE%.log'),
//       datePattern: 'YYYY-MM-DD-HH',
//       level: 'info'
//     }),
//     new DailyRotateFile({
//       filename: path.join(process.cwd(), 'logs', 'winston', 'error', 'error-%DATE%.log'),
//       datePattern: 'YYYY-MM-DD-HH',
//       level: 'error'
//     }),
//     new winston.transports.Console({
//       stderrLevels: ['error']
//     })
//   ]
// });

// export default logger;

import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'winston', 'success', 'success-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      level: 'info'
    }),
    new winston.transports.Console()
  ]
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'winston', 'error', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      level: 'error'
    }),
    new winston.transports.Console({
      stderrLevels: ['error']
    })
  ]
});

export { logger, errorLogger };
