import * as ai from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await ai.generateContent(prompt);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
