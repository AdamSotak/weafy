import { Router } from "express";
import { db } from "../db/db";

const ingressRouter = Router();

const verifyValidDeviceId = async (deviceId: string) => {
    const device = await db.device.findUnique({
        where: {
            id: deviceId
        }
    });
    return device !== null;
}

// POST /api/ingress/plant
// Create a new plant device data record
ingressRouter.post('/plant', async (req, res) => {
    try {
        if (!req.body['device_id']) {
            return res.status(400).json({ error: 'Missing device_id' });
        }

        // if (!await verifyValidDeviceId(req.body['device_id'])) {
        //     return res.status(400).json({ error: 'Invalid device ID' });
        // }

        // Validate required fields (optional 'created_at')
        const requiredFields = ['temperature', 'soil_moisture'];
        for (const field of requiredFields) {
            if (req.body[field] === undefined) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        const recordData : any = {
            deviceId: req.body['device_id'],
            temperature: req.body['temperature'],
            moistureLevel: req.body['soil_moisture'],
        };

        // Include createdAt only if provided
        if (req.body['created_at']) {
            recordData.createdAt = new Date(req.body['created_at'] * 1000);
        }

        const record = await db.plantDeviceRecord.create({
            data: recordData,
        });
        return res.json(record);
    } catch (error) {
        console.error('Error processing plant device record:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// POST /api/ingress/oxygen
// Create a new oxygen device record
ingressRouter.post('/oxygen', async (req, res) => {
    try {
        if (!req.body['device_id']) {
            return res.status(400).json({ error: 'Missing device_id' });
        }

        if (!await verifyValidDeviceId(req.body['device_id'])) {
            return res.status(400).json({ error: 'Invalid device ID' });
        }

        // Validate required fields (optional 'created_at')
        const requiredFields = ['humidity', 'light', 'temperature'];
        for (const field of requiredFields) {
            if (req.body[field] === undefined) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        const recordData : any = {
            deviceId: req.body['device_id'],
            temperature: req.body['temperature'],
            humidity: req.body['humidity'],
            light: req.body['light']
        };

        // Include createdAt only if provided
        if (req.body['created_at']) {
            recordData.createdAt = new Date(req.body['created_at'] * 1000);
        }

        const record = await db.oxygenDeviceRecord.create({
            data: recordData,
        });

        return res.json(record);
    } catch (error) {
        console.error('Error processing oxygen device record:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


export default ingressRouter;