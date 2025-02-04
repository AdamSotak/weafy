import { Router } from "express";
import { db } from "../db/db";
import axios from "axios";
const mlRouter = Router();

// GET /api/ml/watering
// Predict the next watering time
mlRouter.get("/watering", async (req, res) => {
  try {
    const latestPlantRecord = await db.plantDeviceRecord.findFirst({
      take: 1,
      orderBy: {
        createdAt: "desc",
      },
    });
    const latestOxygenRecord = await db.oxygenDeviceRecord.findFirst({
      take: 1,
      orderBy: {
        createdAt: "desc",
      },
    });

    const response = await axios.post(
      `${process.env.ML_URL}/api/predict`,
      {
        soil_temperature: latestPlantRecord?.temperature,
        soil_moisture: latestPlantRecord?.moistureLevel,
        temperature: latestOxygenRecord?.temperature,
        humidity: latestOxygenRecord?.humidity,
        light: latestOxygenRecord?.light,
      },
      {
        headers: {
          Authorization: process.env.ML_API_KEY,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
export default mlRouter;
