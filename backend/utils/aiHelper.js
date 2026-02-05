const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateAITips = async (cropDetails) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured in .env file');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Modified prompt to ensure better formatting
        const promptText = `Provide a detailed farming guide for ${cropDetails.crop_name} 
(Variety: ${cropDetails.variety || 'Not specified'})

Format your response using this exact structure and spacing:

Current Growing Conditions:
• Soil pH: ${cropDetails.soil_ph}
• Field Size: ${cropDetails.field_size} acres
• Irrigation Type: ${cropDetails.irrigation_type}
• Previous Crop: ${cropDetails.previous_crop}

1. Growth Timeline:
• Germination: [Days required]
• Full Maturity: [Total days]
• Key Growth Stages:
  - Stage 1: [Description]
  - Stage 2: [Description]
  - Stage 3: [Description]
  - Stage 4: [Description]

2. Watering Schedule:
• Early Stage: [Frequency and amount]
• Mid Stage: [Frequency and amount]
• Late Stage: [Frequency and amount]
• Critical Points: [List key watering periods]

3. Fertilization Plan:
• Base Fertilizer: [Type and amount]
• First Application: [When and what]
• Second Application: [When and what]
• Final Application: [When and what]

4. Pest Management:
• Common Pests:
  - [Pest 1]: [Control method]
  - [Pest 2]: [Control method]
  - [Pest 3]: [Control method]
• Prevention Steps:
  1. [Step one]
  2. [Step two]
  3. [Step three]

5. Disease Prevention:
• Watch for:
  - [Disease 1]: [Symptoms and treatment]
  - [Disease 2]: [Symptoms and treatment]
  - [Disease 3]: [Symptoms and treatment]

6. Next Actions:
• Immediate Tasks:
  1. [Task one]
  2. [Task two]
  3. [Task three]
• Weekly Checks:
  1. [Check one]
  2. [Check two]
  3. [Check three]

7. Harvest Guide:
• Ready when:
  - [Indicator 1]
  - [Indicator 2]
  - [Indicator 3]
• Expected Yield: [Range per acre]
• Best Conditions: [Ideal harvest conditions]

Remember to use bullet points (•) and proper spacing for clear formatting.`;

        // Generate content
        const result = await model.generateContent(promptText);
        const response = await result.response;
        
        if (!response || !response.text) {
            throw new Error('No response received from AI model');
        }

        // Format the response with proper spacing and line breaks
        const formattedResponse = response.text()
            .replace(/•/g, '•') // Ensure consistent bullet points
            .replace(/\n\n+/g, '\n\n') // Remove extra line breaks
            .split('\n').map(line => line.trim()).join('\n'); // Clean up spacing

        return formattedResponse;
    } catch (err) {
        console.error('AI Error Details:', err);
        return `Error generating farming recommendations: ${err.message}`;
    }
};

module.exports = { generateAITips };