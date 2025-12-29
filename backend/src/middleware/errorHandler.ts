import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    if (err.message.includes('Invalid or expired token')) {
        res.status(401).json({ error: err.message });
        return;
    }

    if (err.message.includes('not found')) {
        res.status(404).json({ error: err.message });
        return;
    }

    if (err.message.includes('Unauthorized') || err.message.includes('forbidden')) {
        res.status(403).json({ error: err.message });
        return;
    }

    res.status(500).json({ error: 'Internal server error' });
};
