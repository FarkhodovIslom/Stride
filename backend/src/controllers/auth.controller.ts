import { Request, Response } from 'express';
import authService from '../services/auth.service';

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name } = req.body;

            const result = await authService.register(email, password, name);

            res.status(201).json(result);
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ error: err.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);

            res.status(200).json(result);
        } catch (error) {
            const err = error as Error;
            res.status(401).json({ error: err.message });
        }
    }
}

export default new AuthController();
