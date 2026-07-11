import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { asumsiPenerimaanSekolah, formatRingkasanKatalogSekolah } from "../data/katalogSekolah.js";
import { buildPipelineContext } from "../lib/context.js";
import { runAiTextPrompt } from "../lib/openai.js";
import { cariKandidatSekolah } from "./schoolMatcher.js";
import type { CreateRecommendationInput } from "../schemas/recommendation.schema.js";

export async function jalankanPipelineRekomendasi(input: CreateRecommendationInput, jobId: string) {
  const kandidatSekolah = cariKandidatSekolah(input);

  const konteks = buildPipelineContext({
    inputSiswa: input,
    asumsiPenerimaanSekolah,
    ringkasanKatalogSekolah: formatRingkasanKatalogSekolah(),
    kandidatSekolah,
  });

  const promptAnalisis = `
Gunakan konteks berikut untuk menganalisis peluang siswa masuk SMA/SMK.

${konteks}

Tugas:
1. Jelaskan profil siswa secara singkat.
2. Analisis kecocokan nilai siswa terhadap kandidat sekolah.
3. Sebutkan risiko jika nilai siswa berada di bawah nilai minimum terbaru.
Jawab dalam Bahasa Indonesia.
`;

  const analisis = await runAiTextPrompt(promptAnalisis);

  const promptRekomendasi = `
Berikut hasil analisis awal:
${analisis}

Konteks data:
${konteks}

Tugas:
Buat rekomendasi 3 sekolah terbaik untuk siswa.
Untuk setiap sekolah, tuliskan:
- Nama sekolah
- Alasan direkomendasikan
- Tingkat peluang: tinggi/sedang/rendah
- Catatan persiapan

Akhiri dengan rekomendasi strategi pilihan aman, realistis, dan ambisius.
`;

  const rekomendasi = await runAiTextPrompt(promptRekomendasi);

  const promptEvaluator = `
Evaluasi kualitas rekomendasi berikut:

${rekomendasi}

Kriteria evaluasi:
1. Relevansi terhadap nilai siswa.
2. Relevansi terhadap jurusan/minat.
3. Relevansi terhadap lokasi.
4. Kejelasan alasan.
5. Kejujuran terhadap keterbatasan data dummy.

Berikan output dalam JSON valid dengan struktur:
{
  "skor": number antara 1 sampai 10,
  "kelebihan": string[],
  "kekurangan": string[],
  "saranPerbaikan": string[]
}
`;

  const evaluasiText = await runAiTextPrompt(promptEvaluator);

  let evaluasi: unknown;
  try {
    evaluasi = JSON.parse(evaluasiText);
  } catch {
    evaluasi = {
      skor: null,
      kelebihan: [],
      kekurangan: ["Evaluator tidak mengembalikan JSON valid."],
      saranPerbaikan: ["Periksa format output evaluator."],
      raw: evaluasiText,
    };
  }

  const outputDir = path.join(process.cwd(), "outputs");
  await mkdir(outputDir, { recursive: true });

  const outputFilePath = path.join(outputDir, `rekomendasi-${jobId}.md`);
  const fileContent = `# Hasil Rekomendasi Sekolah\n\n## Input Siswa\n\n\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\`\n\n## Kandidat Sekolah\n\n\`\`\`json\n${JSON.stringify(kandidatSekolah, null, 2)}\n\`\`\`\n\n## Analisis\n\n${analisis}\n\n## Rekomendasi Akhir\n\n${rekomendasi}\n\n## Evaluasi\n\n\`\`\`json\n${JSON.stringify(evaluasi, null, 2)}\n\`\`\`\n`;

  await writeFile(outputFilePath, fileContent, "utf-8");

  return {
    kandidatSekolah,
    promptResult: {
      analisis,
      rekomendasi,
      evaluasiText,
    },
    recommendation: rekomendasi,
    evaluation: evaluasi,
    outputFilePath,
  };
}
