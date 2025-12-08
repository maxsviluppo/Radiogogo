import { GoogleGenAI } from "@google/genai";
import { RadioStation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStationVibe = async (station: RadioStation): Promise<string> => {
  try {
    const prompt = `
      Genera una descrizione molto breve, suggestiva e "cool" (massimo 2 frasi) 
      per una web radio chiamata "${station.name}" che trasmette musica di genere "${station.genre}".
      
      Usa un tono un po' da DJ radiofonico o poetico. 
      Lingua: Italiano.
      Non usare virgolette.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sintonizzati sul ritmo...";
  } catch (error) {
    console.error("Errore Gemini:", error);
    return "Trasmissione in corso...";
  }
};