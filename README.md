# ai-project-scanner

Tempel struktur folder proyekmu, dan Gemini akan menjelaskan proyek itu: framework apa yang dipakai, tiap berkas berperan sebagai apa, bagian mana yang perlu dibenahi, plus draf README.

Tidak ada backend. API key kamu dikirim langsung dari browser ke Google, tidak disimpan di mana pun.

## Cara pakai

1. Salin struktur proyek, misalnya dengan `tree -I node_modules -L 3 > tree.txt`.
2. Tempel ke kolom input. Struktur diurai jadi pohon yang bisa dirapikan (hapus folder yang tidak perlu, misalnya `dist` atau `.next`, agar hasil lebih fokus).
3. Masukkan API key Gemini ([Google AI Studio](https://aistudio.google.com/apikey)).
4. Tekan analisis. Hasilnya empat bagian:
   - **Ringkasan** — nama proyek, framework, bahasa, jenis arsitektur (Monolith, Microservices, Serverless, SPA, MVC).
   - **Peran berkas** — tiap path diberi label Config, UI, Logic, Data, Utils, Test, Assets, atau Entry, beserta penjelasannya.
   - **Saran perbaikan** — kategori Refactor, Security, Performance, atau Best Practice, dengan tingkat dampak.
   - **Draf README** — siap disalin.

## Menjalankan

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build
```

Model: `gemini-1.5-flash`, `temperature: 0.2`, dipanggil lewat Vercel AI SDK (`generateObject`) dengan skema Zod.

## Struktur

```
src/features/scanner/    treeParser.ts — teks tree → TreeNode; TreeEditor.tsx
src/features/analysis/   schema.ts (skema Zod), prompts/, services/aiAnalysisService.ts, ResultDashboard.tsx
src/components/          Tampilan bersama
```

## Catatan

- Yang dianalisis hanya **nama dan susunan berkas**, isi berkas tidak ikut dikirim. Karena itu penjelasan per berkas bersifat dugaan berdasarkan nama; berkas dengan nama generik seperti `utils.ts` bisa salah tebak.
- Struktur yang terlalu dalam atau terlalu banyak berkas memperbesar penggunaan token dan biaya. Batasi dengan `-L`.
- Output divalidasi Zod. Kalau model mengembalikan bentuk yang tidak sesuai, permintaan diulang, bukan ditampilkan setengah jadi.
