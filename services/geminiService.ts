import { GoogleGenAI } from "@google/genai";
import { RadioStation } from "../types";

// Safe initialization
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

export const getStationVibe = async (station: RadioStation): Promise<string> => {
  // Fallback if no API Key (Public GitHub Repo mode)
  if (!ai) {
    return `Now playing: ${station.genre} vibes.`;
  }

  try {
    const prompt = `
      Genera una descrizione brevissima (max 10 parole), suggestiva e "cool"
      per una web radio chiamata "${station.name}" (${station.genre}).
      Tono: Cyberpunk/Futuristico.
      Lingua: Italiano.
      Nessuna virgoletta.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Segnale agganciato...";
  } catch (error) {
    console.warn("AI Offline, using fallback.");
    return "Connessione neurale instabile...";
  }
};