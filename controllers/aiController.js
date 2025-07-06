const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API client only once when the module loads
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not defined in environment variables. Please check your .env file and dotenv setup.");
    // Exit or throw an error to prevent the server from starting with a misconfigured API key
    // process.exit(1); // Uncomment this line if you want the server to stop on this error
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// *** FIX HERE: Change to a currently supported and recommended model ID ***
// 'gemini-1.5-pro-latest' is generally recommended for robust responses.
// 'gemini-1.5-flash-latest' is faster and more cost-effective for simpler tasks.
// You can also explore 'gemini-2.5-pro' or 'gemini-2.5-flash' if those are fully stable
// in your region and desired for their latest features (check Google's model list).
const MODEL_NAME = 'gemini-2.5-flash'; // OR 'gemini-1.5-flash-latest'

exports.askGemini = async (req, res) => {
    try {
        const { question, context } = req.body;

        // Log incoming request data for debugging
        console.log(`[${new Date().toISOString()}] Received AI question request:`);
        console.log(`  Question: "${question}"`);
        console.log(`  Context: "${context}"`);
        console.log(`  Using Gemini Model: "${MODEL_NAME}"`);

        if (!question) {
            console.warn(`[${new Date().toISOString()}] Bad Request: 'question' is required.`);
            return res.status(400).json({ error: 'Question is required.' });
        }

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `Course context: ${context || 'N/A'}\n\nStudent question: ${question} \n\n" +
"Please provide a concise and clear answer to the student's question with bullet point avoid bold but ans should be bullet and consise " `;

        // Log the constructed prompt for debugging
        console.log(`[${new Date().toISOString()}] Sending prompt to Gemini:`);
        console.log(`--- PROMPT START ---`);
        console.log(prompt);
        console.log(`--- PROMPT END ---`);

        const result = await model.generateContent(prompt);

        const response = await result.response;
        const answer = response.text();

        // Log successful response
        console.log(`[${new Date().toISOString()}] Successfully received Gemini response.`);
        console.log(`  Answer length: ${answer.length}`);

        res.json({ answer: answer });

    } catch (err) {
        // Log the full error object on the server for debugging
        console.error(`[${new Date().toISOString()}] Error in aiController.askGemini:`);
        console.error(err); // Log the entire error object for maximum detail

        // Send a more informative error response to the client during development
        res.status(500).json({
            error: "Failed to get AI response from the server.",
            details: err.message, // Send the error message
            // Only send stack trace in development mode for security reasons
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};