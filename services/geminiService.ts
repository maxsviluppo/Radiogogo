import { GoogleGenAI } from "@google/genai";
import { RadioStation } from "../types";

// Safe initialization of API Key
// Supports both NodeJS process.env (legacy/Next) and Vite import.meta.env
const getApiKey = (): string | undefined => {
  try {
    // Check Vite env
    const meta = import.meta as any;
    if (typeof meta !== "undefined" && meta.env && meta.env.VITE_API_KEY) {
      return meta.env.VITE_API_KEY;
    }
    // Check Process env (fallback)
    // @ts-ignore
    if (typeof process !== "undefined" && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environment check failed, running in offline/demo mode.");
  }
  return undefined;
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey: apiKey });
  } catch (e) {
    console.warn("Failed to initialize GoogleGenAI", e);
  }
}

export const getStationVibe = async (station: RadioStation): Promise<string> => {
  // Fallback if no API Key (Offline Mode)
  if (!ai) {
    const fallbacks = [
      `Vibes: ${station.genre} pure energy.`,
      `Mode: ${station.country} underground.`,
      `Signal: Crystal clear audio.`,
      `Atmosphere: Deep & Resonant.`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
    console.warn("AI Request Failed.");
    return "Connessione neurale instabile...";
  }
};