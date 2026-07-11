export const katalogSekolah = [
  {
    nama: "SMA Negeri 1 Yogyakarta",
    jenis: "SMA",
    jurusan: ["IPA", "IPS"],
    alamat: "Kota Yogyakarta, DI Yogyakarta",
    dayaTampung: 288,
    nilaiMinimum: { 2021: 86.5, 2022: 87.2, 2023: 88.1, 2024: 88.7, 2025: 89.3 },
    catatan: "Sekolah favorit di Kota Yogyakarta dengan nilai masuk relatif tinggi.",
  },
  {
    nama: "SMA Negeri 3 Yogyakarta",
    jenis: "SMA",
    jurusan: ["IPA", "IPS"],
    alamat: "Kota Yogyakarta, DI Yogyakarta",
    dayaTampung: 320,
    nilaiMinimum: { 2021: 85.8, 2022: 86.6, 2023: 87.4, 2024: 88.0, 2025: 88.8 },
    catatan: "Cocok untuk siswa dengan nilai akademik tinggi dan minat ke SMA umum.",
  },
  {
    nama: "SMA Negeri 1 Sleman",
    jenis: "SMA",
    jurusan: ["IPA", "IPS", "Bahasa"],
    alamat: "Kabupaten Sleman, DI Yogyakarta",
    dayaTampung: 300,
    nilaiMinimum: { 2021: 82.4, 2022: 83.1, 2023: 84.0, 2024: 84.7, 2025: 85.5 },
    catatan: "Pilihan SMA umum di wilayah Sleman dengan beberapa pilihan jurusan.",
  },
  {
    nama: "SMA Negeri 1 Bantul",
    jenis: "SMA",
    jurusan: ["IPA", "IPS"],
    alamat: "Kabupaten Bantul, DI Yogyakarta",
    dayaTampung: 288,
    nilaiMinimum: { 2021: 80.5, 2022: 81.3, 2023: 82.0, 2024: 82.8, 2025: 83.6 },
    catatan: "Pilihan SMA umum untuk wilayah Bantul dengan nilai masuk menengah-tinggi.",
  },
  {
    nama: "SMA Negeri 1 Wonosari",
    jenis: "SMA",
    jurusan: ["IPA", "IPS"],
    alamat: "Kabupaten Gunungkidul, DI Yogyakarta",
    dayaTampung: 252,
    nilaiMinimum: { 2021: 78.2, 2022: 79.0, 2023: 79.8, 2024: 80.5, 2025: 81.4 },
    catatan: "Pilihan SMA umum di wilayah Gunungkidul.",
  },
  {
    nama: "SMA Negeri 1 Pengasih",
    jenis: "SMA",
    jurusan: ["IPA", "IPS"],
    alamat: "Kabupaten Kulon Progo, DI Yogyakarta",
    dayaTampung: 252,
    nilaiMinimum: { 2021: 77.5, 2022: 78.4, 2023: 79.2, 2024: 80.0, 2025: 80.8 },
    catatan: "Pilihan SMA umum di wilayah Kulon Progo.",
  },
  {
    nama: "SMK Negeri 2 Yogyakarta",
    jenis: "SMK",
    jurusan: ["Teknik Komputer dan Jaringan", "Teknik Mesin", "Teknik Elektro"],
    alamat: "Kota Yogyakarta, DI Yogyakarta",
    dayaTampung: 360,
    nilaiMinimum: { 2021: 79.4, 2022: 80.2, 2023: 81.1, 2024: 82.0, 2025: 82.7 },
    catatan: "Cocok untuk siswa yang tertarik bidang teknik dan teknologi.",
  },
  {
    nama: "SMK Negeri 1 Depok Sleman",
    jenis: "SMK",
    jurusan: ["Akuntansi", "Manajemen Perkantoran", "Bisnis Digital"],
    alamat: "Kabupaten Sleman, DI Yogyakarta",
    dayaTampung: 324,
    nilaiMinimum: { 2021: 78.8, 2022: 79.5, 2023: 80.3, 2024: 81.1, 2025: 81.9 },
    catatan: "Cocok untuk siswa yang tertarik bidang bisnis, administrasi, dan akuntansi.",
  },
  {
    nama: "SMK Negeri 1 Bantul",
    jenis: "SMK",
    jurusan: ["Rekayasa Perangkat Lunak", "Multimedia", "Akuntansi"],
    alamat: "Kabupaten Bantul, DI Yogyakarta",
    dayaTampung: 336,
    nilaiMinimum: { 2021: 77.0, 2022: 78.1, 2023: 79.0, 2024: 79.8, 2025: 80.6 },
    catatan: "Cocok untuk siswa yang tertarik bidang software, multimedia, atau akuntansi.",
  },
  {
    nama: "SMK Negeri 1 Wonosari",
    jenis: "SMK",
    jurusan: ["Teknik Kendaraan Ringan", "Teknik Komputer", "Tata Boga"],
    alamat: "Kabupaten Gunungkidul, DI Yogyakarta",
    dayaTampung: 300,
    nilaiMinimum: { 2021: 75.6, 2022: 76.4, 2023: 77.3, 2024: 78.2, 2025: 79.0 },
    catatan: "Cocok untuk siswa yang ingin masuk jalur vokasi dengan beberapa pilihan keahlian.",
  },
] as const;

export const asumsiPenerimaanSekolah = {
  provinsi: "DI Yogyakarta",
  jenisData: "data_dummy",
  jenisNilai: "nilai_minimum_masuk",
  tahun: [2021, 2022, 2023, 2024, 2025],
  peringatan: "Data ini adalah dummy untuk kebutuhan assignment, bukan data resmi PPDB.",
} as const;

export function formatRingkasanKatalogSekolah(): string {
  return katalogSekolah
    .map((sekolah) => {
      const nilai = sekolah.nilaiMinimum;
      return `- ${sekolah.nama}: ${sekolah.jenis}, jurusan ${sekolah.jurusan.join(", ")}, alamat ${sekolah.alamat}, daya tampung ${sekolah.dayaTampung} siswa, nilai minimum 2021-2025: ${nilai[2021]}, ${nilai[2022]}, ${nilai[2023]}, ${nilai[2024]}, ${nilai[2025]}. ${sekolah.catatan}`;
    })
    .join("\n");
}
