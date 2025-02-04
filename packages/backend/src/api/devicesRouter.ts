import { Router } from "express";
import { db } from "../db/db";

const devicesRouter = Router();

// GET /api/devices
// Get all devices
devicesRouter.get('/', async (req, res) => {
    try {
        const devices = await db.device.findMany();
        return res.json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/devices/:id
// Get a device by id
devicesRouter.get('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing device ID' });
        }

        const device = await db.device.findUnique({
            where: { id: req.params.id }
        });

        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        return res.json(device);
    } catch (error) {
        console.error('Error fetching device:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/devices
// Create a new device
devicesRouter.post('/', async (req, res) => {
    try {
        // Validate required fields based on your schema
        const requiredFields = ['id', 'name', 'type'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        const device = await db.device.create({
            data: req.body
        });
        return res.json(device);
    } catch (error) {
        console.error('Error creating device:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Device ID already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/devices/:id
// Update a device; ping the device to register
devicesRouter.put('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing device ID' });
        }

        // Check if device exists
        const existingDevice = await db.device.findUnique({
            where: { id: req.params.id }
        });

        if (!existingDevice) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const device = await db.device.update({
            where: { id: req.params.id },
            data: req.body
        });
        return res.json(device);
    } catch (error) {
        console.error('Error updating device:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/devices/:id
// Delete a device
devicesRouter.delete('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Missing device ID' });
        }

        // Check if device exists
        const existingDevice = await db.device.findUnique({
            where: { id: req.params.id }
        });

        if (!existingDevice) {
            return res.status(404).json({ error: 'Device not found' });
        }

        await db.device.delete({
            where: { id: req.params.id }
        });
        return res.json({ message: 'Device deleted' });
    } catch (error) {
        console.error('Error deleting device:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default devicesRouter;