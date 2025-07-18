
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const generateReport = async (topic: string): Promise<{ text: string; sources: GroundingSource[] } | null> => {
  try {
    const prompt = `Agisci come un ricercatore esperto di livello mondiale. Genera una relazione approfondita, dettagliata e ben strutturata sull'argomento: "${topic}". La relazione deve essere completa e il più lunga possibile, come se fosse un capitolo di un libro di testo o un articolo enciclopedico. Utilizza le tue conoscenze e le informazioni più recenti disponibili per fornire un'analisi completa. Inizia la relazione con un titolo appropriato in grassetto (es. **Titolo della Relazione**), seguito da un'introduzione, vari paragrafi di sviluppo e una conclusione. Formatta il testo utilizzando markdown per chiarezza (es. titoli, sottotitoli, elenchi puntati).`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingSource[] = groundingMetadata?.groundingChunks?.filter(
        (chunk): chunk is GroundingSource => 'web' in chunk && !!chunk.web?.uri
    ) || [];

    return { text, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the generative AI model.");
  }
};
