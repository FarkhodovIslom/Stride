import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = verifyToken(token);
            
            // Validate MongoDB ObjectId format (24 hex characters)
            if (!decoded.id.match(/^[0-9a-fA-F]{24}$/)) {
                res.status(401).json({ error: 'Invalid token format (old session)' });
                return;
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
    } catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};
