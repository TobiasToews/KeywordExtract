
import { GoogleGenAI } from "@google/genai";
import { PromptTemplate, ExtractedItem, AnalysisResult } from "../types";

export const runAnalysis = async (
  template: PromptTemplate,
  paperText: string,
  paperId: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';
  
  const prompt = template.user_template.replace('{text}', paperText);

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: template.system,
      temperature: 0.1, // Low temperature for high precision extraction
    }
  });

  const rawText = response.text || "";
  const { parsedItems, errors } = parseModelOutput(rawText);

  return {
    paperId,
    promptId: template.id,
    rawResponse: rawText,
    parsedItems,
    timestamp: new Date().toISOString(),
    model: modelName,
    errors: errors.length > 0 ? errors : undefined
  };
};

const parseModelOutput = (text: string): { parsedItems: ExtractedItem[], errors: string[] } => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const parsedItems: ExtractedItem[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Handle specialized "YES/NO" starts by simply skipping the header line for item extraction
    if (trimmedLine.toUpperCase() === 'YES' || trimmedLine.toUpperCase() === 'NO') {
      return;
    }

    const parts = line.split('|');
    if (parts.length === 2) {
      const keyword = parts[0].trim();
      let quote = parts[1].trim();
      
      // Clean up quotes
      if (quote.startsWith('"') && quote.endsWith('"')) {
        quote = quote.substring(1, quote.length - 1);
      } else if (quote.startsWith('\"') && quote.endsWith('\"')) {
        quote = quote.substring(1, quote.length - 1);
      }
      
      if (keyword && quote) {
        parsedItems.push({ keyword, quote });
      } else {
        errors.push(`Line ${index + 1}: Missing keyword or quote content.`);
      }
    } else {
      // Ignore common model conversational markers, but log unexpected format issues
      const isNoise = trimmedLine.startsWith('---') || trimmedLine.startsWith('***') || trimmedLine.startsWith('#');
      if (!isNoise) {
         errors.push(`Line ${index + 1}: Incorrect format (expected one '|').`);
      }
    }
  });

  return { parsedItems, errors };
};
