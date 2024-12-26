import { Request, Response, NextFunction } from 'express';

const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
     res.status(403).json({ error: 'Admin privileges required' });
  }
  next();  // If the user is an admin, proceed to the next middleware or route handler
};

export default adminMiddleware;
