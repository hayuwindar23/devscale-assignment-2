import "dotenv/config";
import { Worker } from "bullmq";
import { prisma } from "../lib/prisma.js";
import { redisConnection } from "../queues/recommendationQueue.js";
import { jalankanPipelineRekomendasi } from "../services/recommendationAiPipeline.js";
import { createRecommendationSchema } from "../schemas/recommendation.schema.js";

const worker = new Worker(
  "school-recommendation-queue",
  async (job) => {
    const jobId = job.data.jobId as string;

    await prisma.schoolRecommendationJob.update({
      where: { id: jobId },
      data: { status: "PROCESSING" },
    });

    try {
      const dbJob = await prisma.schoolRecommendationJob.findUniqueOrThrow({
        where: { id: jobId },
      });

      const input = createRecommendationSchema.parse(dbJob.input);
      const result = await jalankanPipelineRekomendasi(input, jobId);

      await prisma.schoolRecommendationJob.update({
        where: { id: jobId },
        data: {
          status: "COMPLETED",
          candidateSchools: result.kandidatSekolah,
          promptResult: result.promptResult,
          recommendation: result.recommendation,
          evaluation: result.evaluation as object,
          outputFilePath: result.outputFilePath,
        },
      });

      return { success: true, jobId };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await prisma.schoolRecommendationJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          errorMessage: message,
        },
      });
      throw error;
    }
  },
  { connection: redisConnection },
);

worker.on("completed", (job) => {
  console.log(`Job selesai: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Job gagal: ${job?.id}`, error);
});

console.log("Worker rekomendasi sekolah berjalan...");
