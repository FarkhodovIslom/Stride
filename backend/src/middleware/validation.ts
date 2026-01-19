import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Middleware to validate request body against a DTO class
 */
export function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body) {
            res.status(400).json({ error: 'Missing request body' });
            return;
        }

        const dtoInstance = plainToInstance(dtoClass, req.body);
        
        if (typeof dtoInstance !== 'object' || dtoInstance === null) {
             res.status(400).json({ error: 'Invalid request body' });
             return;
        }

        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            const formattedErrors = errors.map((error) => ({
                property: error.property,
                constraints: error.constraints,
            }));
            res.status(400).json({
                error: 'Validation failed',
                details: formattedErrors,
            });
            return;
        }

        // Replace req.body with validated instance
        req.body = dtoInstance;
        next();
    };
}
