import { createLogger, format, transports, addColors } from 'winston'
import __dirname from '../src/utils.js'

const { timestamp, combine, printf, colorize, errors, json } = format

const myLogFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`
})

const customLogger = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3
  },
  colors: {
    error: 'bold italic red',
    warning: 'bold italic yellow',
    info: 'bold italic green',
    debug: 'bold italic cyan'
  }
}

export const logger = createLogger({
  levels: customLogger.levels,
  level: 'debug',
  transports: [
    new transports.File({
      level: 'error',
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/log-errors.log`,
      format: combine(timestamp(), errors({ stack: true }), myLogFormat, json())
    }),



    new transports.Console({
      format: combine(
        colorize(addColors(customLogger.colors)),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        myLogFormat
      )
    })
  ]
})

const developmentLevel = process.env.LOGGER_DEVELOPMENT_LEVEL || 'debug';
const productionLevel = process.env.LOGGER_PRODUCTION_LEVEL || 'info';

// Logger de desarrollo
export const developmentLogger = createLogger({
  levels: customLogger.levels,
  level: developmentLevel,
  transports: [
    new transports.Console({
      format: combine(
        colorize(addColors(customLogger.colors)),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        myLogFormat
      )
    })
  ]
});

// Logger de producción
export const productionLogger = createLogger({
  levels: customLogger.levels,
  level: productionLevel,
  transports: [
    new transports.File({
      level: 'info',
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/log-info.log`,
      format: combine(timestamp(), errors({ stack: true }), myLogFormat, json())
    })
  ]
});