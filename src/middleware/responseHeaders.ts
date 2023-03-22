import { NextFunction, Request, Response } from 'express';
import { ALLOWED_ORIGINS } from '../config';
import log from '../scripts/log';

const responseHeaders = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin: string | undefined = req.headers.origin;
    if (origin !== undefined && ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      log('Origin is not allowed');
    }
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE');
    next();
  };
};

export default responseHeaders;
