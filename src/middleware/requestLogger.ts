import { NextFunction, Request, Response } from 'express';
import log from '../scripts/log';

const requestLogger = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    log(`${req.method}\torigin: ${req.headers.origin}\turl: ${req.url}`);
    next();
  };
};

export default requestLogger;
