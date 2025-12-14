
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
      "SIGNAL: OPTIMAL // UPLINK ESTABLISHED",
      "VIBE DETECTED: NEON NIGHTS",
      "SYSTEM: AUDIO STREAM SYNCHRONIZED",
      "MOOD: ELECTRIC DREAMS DETECTED"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  try {
    const prompt = `
      Sei un'interfaccia futuristica di una radio cyberpunk.
      Genera una frase di stato "System Log" molto breve (massimo 6 parole) basata sul genere "${station.genre}".
      Stile: Tecnico, Criptico, Atmosferico, Sci-Fi.
      Esempi: "ANALYZING BASS FREQUENCIES...", "UPLINK SECURE: JAZZ PROTOCOL", "DETECTING HIGH ENERGY WAVES".
      Lingua: Inglese Tecnico o Italiano Tecnico.
      Nessuna virgoletta.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim().toUpperCase() || "SYSTEM: ONLINE";
  } catch (error) {
    console.warn("AI Request Failed.");
    return "LINK: RE-ESTABLISHING...";
  }
};
