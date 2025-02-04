import e, { Router } from "express";
import { db } from "../db/db";
import { Config } from "@water-app/config/src/config";

const egressRouter = Router();

// GET /api/egress/plant
// Get all plant device records with pagination
egressRouter.get('/plant', async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        
        // Validate page number
        if (isNaN(page) || page < 1) {
            return res.status(400).json({ error: 'Invalid page number' });
        }

        const records = await db.plantDeviceRecord.findMany({
            take: Config.PAGE_SIZE,
            skip: (page - 1) * Config.PAGE_SIZE,
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return res.json(records);
    } catch (error) {
        console.error('Error fetching plant device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/egress/oxygen
// Get all oxygen device records with pagination
egressRouter.get('/oxygen', async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        
        // Validate page number
        if (isNaN(page) || page < 1) {
            return res.status(400).json({ error: 'Invalid page number' });
        }

        const records = await db.oxygenDeviceRecord.findMany({
            take: Config.PAGE_SIZE,
            skip: (page - 1) * Config.PAGE_SIZE,
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return res.json(records);
    } catch (error) {
        console.error('Error fetching oxygen device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// This section is for data calls that retrieve all records without pagination
egressRouter.get('/plant/ml', async (req, res) => {
    try {
        const startDate = String(req.query.start_date);
        const endDate = String(req.query.end_date);

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start and end dates are required' });
        }

        const records = await db.plantDeviceRecord.findMany({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.json(records);
    } catch (error) {
        console.error('Error fetching plant device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

egressRouter.get('/oxygen/ml', async (req, res) => {
    try {
        const startDate = String(req.query.start_date);
        const endDate = String(req.query.end_date);
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start and end dates are required' });
        }

        const records = await db.oxygenDeviceRecord.findMany({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.json(records);
    } catch (error) {
        console.error('Error fetching oxygen device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Charts
// GET /api/egress/plant/charts/moisture/:deviceId
egressRouter.get('/plant/charts/moisture/:deviceId', async (req, res) => {
    try {
        const records = await db.plantDeviceRecord.findMany({
            where: {
                deviceId: req.params.deviceId
            }
        });

        return res.json(records.map((record) => ({
            value: record.moistureLevel,
            timestamp: record.createdAt,
        })));
    } catch (error) {
        console.error('Error fetching plant device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/egress/plant/charts/temperature/:deviceId
egressRouter.get('/plant/charts/temperature/:deviceId', async (req, res) => {
    try {
        const records = await db.plantDeviceRecord.findMany({
            where: {
                deviceId: req.params.deviceId
            }
        });
        return res.json(records.map((record) => ({
            value: record.temperature,
            timestamp: record.createdAt,
        })));
    } catch (error) {
        console.error('Error fetching plant device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/egress/oxygen/charts/humidity/:deviceId
egressRouter.get('/oxygen/charts/humidity/:deviceId', async (req, res) => {
    try {
        const records = await db.oxygenDeviceRecord.findMany({
            where: {
                deviceId: req.params.deviceId
            }
        });
        return res.json(records.map((record) => ({
            value: record.humidity,
            timestamp: record.createdAt,
        })));
    } catch (error) {
        console.error('Error fetching oxygen device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/egress/oxygen/charts/temperature/:deviceId
egressRouter.get('/oxygen/charts/temperature/:deviceId', async (req, res) => {
    try {
        const records = await db.oxygenDeviceRecord.findMany({
            where: {
                deviceId: req.params.deviceId
            }
        });
        return res.json(records.map((record) => ({
            value: record.temperature,
            timestamp: record.createdAt,
        })));
    } catch (error) {
        console.error('Error fetching oxygen device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/egress/oxygen/charts/light/:deviceId
egressRouter.get('/oxygen/charts/light/:deviceId', async (req, res) => {
    try {
        const records = await db.oxygenDeviceRecord.findMany({
            where: {
                deviceId: req.params.deviceId
            }
        });
        return res.json(records.map((record) => ({
            value: record.light,
            timestamp: record.createdAt,
        })));
    } catch (error) {
        console.error('Error fetching oxygen device records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default egressRouter;