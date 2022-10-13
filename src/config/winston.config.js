import winston, { format } from 'winston';

let logLevel = process.env.LOGS;

const logger = winston.createLogger({
    format: format.combine(format.simple()),
    transports:[
        new winston.transports.Console({
            level:logLevel
        }),
        new winston.transports.File({
            level:logLevel,
            filename:'error_logs'})
    ]
});

export default logger;