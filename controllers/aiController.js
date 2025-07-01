const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// To check available models, you can use: await genAI.listModels();
// Use the latest available model name, e.g., 'gemini-1.0-pro-latest'
exports.askGemini = async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required.' });
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro-latest' });
    const prompt = `Course context: ${context || 'N/A'}\n\nStudent question: ${question}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ answer: response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 