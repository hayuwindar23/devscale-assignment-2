import { z } from "zod";

export const createRecommendationSchema = z.object({
  studentName: z.string().min(2, "Nama siswa wajib diisi minimal 2 karakter"),
  score: z.number().min(0).max(100),
  preferredMajor: z.string().min(2, "Jurusan/minat wajib diisi"),
  preferredLocation: z.string().optional(),
  schoolType: z.enum(["SMA", "SMK", "BEBAS"]).default("BEBAS"),
  notes: z.string().optional(),
});

export type CreateRecommendationInput = z.infer<typeof createRecommendationSchema>;
