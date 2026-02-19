import { GoogleGenAI } from "@google/genai";

// Initialize the API client
const apiKey = process.env.API_KEY || ''; // In a real app, handle missing key gracefully
const ai = new GoogleGenAI({ apiKey });

export const getTransformationInsight = async (time: number): Promise<string> => {
  if (!apiKey) {
    return "Transformação digital é sobre pessoas, não apenas tecnologia. Parabéns pelo resultado!";
  }

  try {
    const model = 'gemini-2.5-flash-latest'; // Using Flash for speed as per instructions for general text if not specified, but prompt says use 3-flash for basic. Let's use 3-flash-preview.
    // Correction: Prompt says "Basic Text Tasks...: 'gemini-3-flash-preview'".
    
    const prompt = `
      Generate a short, inspiring, one-sentence quote or fact about Digital Transformation in the Public Sector (GovTech).
      The user just completed a puzzle in ${time} seconds.
      If the time is under 60 seconds, praise their speed and efficiency (like a modern digital government).
      If over 60 seconds, praise their persistence and thoroughness.
      Language: Portuguese (Brazil).
      Tone: Professional, Innovative, Softplan style.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Juntos, transformamos o setor público com eficiência e inovação.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A tecnologia impulsiona o futuro do setor público. Parabéns!";
  }
};
