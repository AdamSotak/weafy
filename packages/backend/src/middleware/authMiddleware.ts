import { Request, Response, NextFunction } from 'express';

export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['authorization'];

    if (!apiKey) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    if (apiKey !== process.env.SERVICE_API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
}; 