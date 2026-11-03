# ai-project-scanner

Paste a project's file tree, get back an architecture review and a README draft.

No cloning, no repository access, no build step on the analysed project — the tool works purely
from the folder structure you give it, which is often enough to infer the stack, the layering and
the parts that have gone messy.

## How it works

1. **Paste or edit the tree.** `TreeEditor` accepts output from `tree`, `find` or an IDE copy. The
   raw text is normalised by `treeParser` into a structure the model can reason about.
2. **Analyse.** `aiAnalysisService` sends the tree to Gemini through the **Vercel AI SDK**
   (`@ai-sdk/google`) with a system prompt that acts as a senior architect.
3. **Constrain the output.** The response is validated against a **Zod** schema, so a malformed
   answer fails loudly instead of rendering garbage. The schema covers the detected stack, the
   role of each folder, anti-patterns, and ready-to-paste README content.
4. **Render.** `ResultDashboard` presents stack, folder roles, problems and the generated README.

The system prompt is deliberately strict: infer only what is present in the tree, treat the
presence of `tsconfig.json` as TypeScript, and never invent files. That is the whole point — a
review that hallucinates structure is worse than no review.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · @ai-sdk/google · Zod · Zustand · framer-motion ·
lucide-react

## Setup

```bash
pnpm install
```

Create a `.env` with a Google Generative AI key:

```
VITE_GOOGLE_GENERATIVE_AI_API_KEY=...
```

## Run

```bash
pnpm dev
```

```bash
pnpm build     # tsc -b && vite build
pnpm lint
```

## Structure

```
src/
  features/scanner/
    components/TreeEditor.tsx        tree input and editing
    utils/treeParser.ts              normalise pasted tree text
  features/analysis/
    hooks/useProjectAnalysis.ts      request lifecycle
    services/aiAnalysisService.ts    Gemini call via AI SDK
    prompts/systemPrompts.ts         analyst system prompt + task template
    schema.ts                        Zod schema for the response
    components/ResultDashboard.tsx   rendered review
  App.tsx
```

## Notes

- Everything runs in the browser; the API key ships to the client. That is acceptable for a local
  tool, **not** for a public deployment — put the call behind a server route before hosting it.
- This is intentionally a sibling of `repxray`, which does the same job from a real repository
  instead of a pasted tree.

## License

MIT
