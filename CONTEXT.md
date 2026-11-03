# ai-project-scanner — Project Context

## Ringkasan

Web app satu halaman: tempel struktur folder proyek, lalu model AI menjelaskan proyek itu — tech
stack, tujuan, dan saran perbaikan. Tidak ada backend; kunci API Gemini dipakai langsung dari browser.

## Alur

```
Tempel/unggah struktur folder
        ↓  (TreeEditor)
treeParser → daftar path ternormalisasi
        ↓
aiAnalysisService → Gemini (via Vercel AI SDK, @ai-sdk/google)
        ↓
schema.ts (Zod) memvalidasi keluaran model
        ↓
ResultDashboard menampilkan hasil
```

Validasi Zod adalah bagian penting: keluaran model tidak pernah dipercaya mentah. Kalau bentuknya
tidak sesuai skema, hasil dibuang dan pengguna diminta mencoba lagi, bukan dirender setengah jadi.

## Struktur

```
src/App.tsx                              Susunan halaman
src/features/scanner/components/TreeEditor.tsx   Input struktur folder
src/features/scanner/utils/treeParser.ts         Parsing teks → daftar path
src/features/analysis/services/aiAnalysisService.ts  Pemanggilan model
src/features/analysis/prompts/systemPrompts.ts   Instruksi sistem
src/features/analysis/schema.ts                  Skema hasil (Zod)
src/features/analysis/components/ResultDashboard.tsx  Tampilan hasil
src/features/analysis/hooks/useProjectAnalysis.ts     State alur
```

## Menjalankan

```bash
pnpm install
pnpm dev
```

Kunci API diisi lewat antarmuka (disimpan di browser). Build: `pnpm build`.

## Catatan

- Karena kunci disimpan di klien, jangan pakai kunci dengan kuota produksi; batasi per kunci.
- Struktur folder yang sangat besar (ribuan baris) perlu dipangkas manual — tidak ada pemotongan
  otomatis sebelum dikirim ke model.
