import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AnalysisSchema, type AnalysisResult } from '../schema';
import { ANALYST_SYSTEM_PROMPT, USER_PROMPT_TEMPLATE } from '../prompts/systemPrompts';

interface AnalyzeParams {
  fileTree: string;
  apiKey: string;
}

export async function analyzeProject({ fileTree, apiKey }: AnalyzeParams): Promise<AnalysisResult> {
  if (!apiKey) throw new Error("API Key is required");

  // 1. Inisialisasi Google Provider
  const google = createGoogleGenerativeAI({
    apiKey,
  });

  // 2. PILIH MODEL (FIX DISINI)
  // Kita gunakan string polos 'gemini-1.5-flash' tanpa embel-embel 'models/'
  // Ini otomatis dipetakan oleh SDK terbaru ke endpoint yang benar.
  const model = google('gemini-1.5-flash');

  try {
    const result = await generateObject({
      model,
      schema: AnalysisSchema,
      system: ANALYST_SYSTEM_PROMPT,
      prompt: USER_PROMPT_TEMPLATE(fileTree),
      temperature: 0.2, // Tetap rendah biar output stabil
    });

    return result.object;
  } catch (error) {
    console.error("AI Error Detail:", error);
    
    // Error Handling yang lebih jelas buat debugging
    if (error instanceof Error) {
       if (error.message.includes('404')) {
         throw new Error("Model tidak ditemukan. Pastikan API Key valid dan package '@ai-sdk/google' sudah diupdate.");
       }
       throw new Error(`Gagal analisis: ${error.message}`);
    }
    throw new Error("Terjadi kesalahan tak terduga pada AI.");
  }
}