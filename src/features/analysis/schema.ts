import { z } from 'zod';

// 1. Schema untuk Output AI (Hasil Analisis)
export const AnalysisSchema = z.object({
  overview: z.object({
    projectName: z.string(),
    framework: z.string(),
    language: z.string(),
    architectureType: z.enum(['Monolith', 'Microservices', 'Serverless', 'SPA', 'MVC', 'Unknown']),
    description: z.string(),
  }),
  fileRoles: z.array(z.object({
    path: z.string(),
    role: z.enum(['Config', 'UI', 'Logic', 'Data', 'Utils', 'Test', 'Assets', 'Entry']),
    explanation: z.string(),
  })),
  suggestions: z.array(z.object({
    title: z.string(),
    type: z.enum(['Refactor', 'Security', 'Performance', 'Best Practice']),
    description: z.string(),
    impact: z.enum(['High', 'Medium', 'Low']),
  })),
  readmeContent: z.string(),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

export type TreeNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
};