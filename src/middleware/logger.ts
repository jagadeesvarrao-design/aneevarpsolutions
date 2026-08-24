import morgan from 'morgan';

export const loggerMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms');
