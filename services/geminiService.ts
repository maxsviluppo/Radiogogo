import { GoogleGenAI } from "@google/genai";
import { RadioStation } from "../types";

// Safe initialization of API Key
// This prevents "ReferenceError: process is not defined" on static hosts like GitHub Pages
const getApiKey = (): string | undefined => {
  try {
    // @ts-ignore
    if (typeof process !== "undefined" && process.env) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environment process not found, running in offline/demo mode.");
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
  // Fallback if no API Key (Public GitHub Repo mode / Static Host)
  if (!ai) {
    // Simulazione di una risposta AI per evitare spazi vuoti
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
    console.warn("AI Request Failed (Offline or Quota Exceeded).");
    return "Connessione neurale instabile...";
  }
};