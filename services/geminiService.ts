
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptTemplate, ExtractedItem, AnalysisResult } from "../types";

export const runAnalysis = async (
  template: PromptTemplate,
  paperText: string,
  paperId: string,
  paperName: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';
  
  const prompt = template.user_template.replace('{text}', paperText);

  // Define the schema for structured JSON output
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            keyword: { 
              type: Type.STRING, 
              description: "The extracted atomic concept or keyword." 
            },
            quote: { 
              type: Type.STRING, 
              description: "The exact verbatim quote from the text supporting the keyword." 
            },
            confidence: { 
              type: Type.NUMBER, 
              description: "A score between 0.0 and 1.0 indicating confidence that the quote is an exact match and highly relevant." 
            }
          },
          required: ["keyword", "quote", "confidence"]
        }
      }
    },
    required: ["items"]
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: template.system,
      temperature: 0.1, // Low temperature for factual extraction
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  const rawText = response.text || "{}";
  let parsedItems: ExtractedItem[] = [];
  let errors: string[] = [];

  try {
    const jsonResponse = JSON.parse(rawText);
    if (jsonResponse.items && Array.isArray(jsonResponse.items)) {
      parsedItems = jsonResponse.items;
    } else {
      errors.push("Model returned valid JSON but missing 'items' array.");
    }
  } catch (e: any) {
    errors.push(`JSON Parse Error: ${e.message}`);
    console.error("Failed to parse JSON response:", rawText);
  }

  return {
    paperId,
    paperName,
    promptId: template.id,
    rawResponse: rawText,
    parsedItems,
    timestamp: new Date().toISOString(),
    model: modelName,
    errors: errors.length > 0 ? errors : undefined
  };
};
