import { useState } from 'react';
import type { AnalysisResult } from '../schema'; 
import { analyzeProject } from '../services/aiAnalysisService';

export function useProjectAnalysis() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (fileTree: string, apiKey: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      if (!fileTree.trim()) throw new Error("Folder tree tidak boleh kosong");
      
      const result = await analyzeProject({ fileTree, apiKey });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan tak terduga");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, runAnalysis };
}