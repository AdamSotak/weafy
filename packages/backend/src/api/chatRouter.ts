import { Router } from "express";
import { openai } from "../lib/ai";
import { db } from "../db/db";

const chatRouter = Router();

// POST /api/chat
// Send a message and history to the AI and get a response
chatRouter.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Load plants and devices data
    const plantDeviceRecords = await db.plantDeviceRecord.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    const oxygenDeviceRecords = await db.oxygenDeviceRecord.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Create system message with context
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant expert in personal environmental health.
                Answer questions about how the plants are doing and the room conditions based on the data available to you.
                Evaluate if the plants need more water, change in temperature, ambient light, room temperature and humidity.
                Answer questions about room conditions based on the plant and oxygen device data.
                Use plant names to refer to the plants.
                Be brief and concise in your responses and recommendations - maximum 7 sentences.
                Provide recommendations for the user based on the data available to you.
                Consider all data available to you - message history and plant/oxygen device data.

                Refuse to answer questions about anything else.

                Plant data: ${JSON.stringify(plantDeviceRecords)}
                Oxygen data: ${JSON.stringify(oxygenDeviceRecords)}`
    };

    // Add system message at the start of the conversation
    const messages = [
      systemMessage,
      ...(history || []),
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    res.status(200).json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default chatRouter;