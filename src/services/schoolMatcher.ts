import { katalogSekolah } from "../data/katalogSekolah.js";
import type { CreateRecommendationInput } from "../schemas/recommendation.schema.js";

type School = (typeof katalogSekolah)[number];

function getNilaiTerbaru(sekolah: School): number {
  return sekolah.nilaiMinimum[2025];
}

function hitungSkorKecocokan(sekolah: School, input: CreateRecommendationInput): number {
  let skor = 0;
  const nilaiMinimumTerbaru = getNilaiTerbaru(sekolah);

  if (input.score >= nilaiMinimumTerbaru) skor += 45;
  else if (input.score >= nilaiMinimumTerbaru - 3) skor += 25;
  else if (input.score >= nilaiMinimumTerbaru - 6) skor += 10;

  const jurusanText = sekolah.jurusan.join(" ").toLowerCase();
  const minat = input.preferredMajor.toLowerCase();
  if (jurusanText.includes(minat)) skor += 30;
  else if (minat.includes("komputer") && jurusanText.includes("komputer")) skor += 30;
  else if (minat.includes("software") && jurusanText.includes("perangkat lunak")) skor += 30;
  else if (minat.includes("akuntansi") && jurusanText.includes("akuntansi")) skor += 30;
  else if (minat.includes("ipa") && jurusanText.includes("ipa")) skor += 30;
  else if (minat.includes("ips") && jurusanText.includes("ips")) skor += 30;

  if (input.schoolType && input.schoolType !== "BEBAS" && sekolah.jenis === input.schoolType) skor += 15;
  if (input.schoolType === "BEBAS") skor += 5;

  if (input.preferredLocation) {
    const lokasi = input.preferredLocation.toLowerCase();
    if (sekolah.alamat.toLowerCase().includes(lokasi)) skor += 10;
  }

  return skor;
}

export function cariKandidatSekolah(input: CreateRecommendationInput) {
  return katalogSekolah
    .map((sekolah) => ({
      ...sekolah,
      nilaiMinimumTerbaru: getNilaiTerbaru(sekolah),
      selisihNilai: Number((input.score - getNilaiTerbaru(sekolah)).toFixed(2)),
      skorKecocokan: hitungSkorKecocokan(sekolah, input),
    }))
    .sort((a, b) => b.skorKecocokan - a.skorKecocokan)
    .slice(0, 5);
}
