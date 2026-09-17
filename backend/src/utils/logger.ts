import winston from 'winston';

const transports: winston.transport[] = [
  // Always log to stdout/stderr so the platform (Vercel/Docker) captures logs.
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
];

// En Vercel el disco es de sólo lectura: los archivos de log sólo en local.
if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

export default logger;
