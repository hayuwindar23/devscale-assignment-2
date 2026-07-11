import { Hono } from "hono";
import { prisma } from "../lib/prisma.js";
import { recommendationQueue } from "../queues/recommendationQueue.js";
import { createRecommendationSchema } from "../schemas/recommendation.schema.js";

export const recommendationRoutes = new Hono();

recommendationRoutes.post("/recommendations", async (c) => {
  const body = await c.req.json();
  const parsed = createRecommendationSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        message: "Input tidak valid",
        errors: parsed.error.flatten(),
      },
      400,
    );
  }

  const input = parsed.data;

  const dbJob = await prisma.schoolRecommendationJob.create({
    data: {
      studentName: input.studentName,
      score: input.score,
      preferredMajor: input.preferredMajor,
      preferredLocation: input.preferredLocation,
      schoolType: input.schoolType,
      notes: input.notes,
      input,
      status: "PENDING",
    },
  });

  await recommendationQueue.add("process-school-recommendation", {
    jobId: dbJob.id,
  });

  return c.json(
    {
      success: true,
      message: "Input diterima. Job rekomendasi sekolah masuk queue.",
      data: {
        id: dbJob.id,
        status: dbJob.status,
      },
    },
    201,
  );
});

recommendationRoutes.get("/recommendations", async (c) => {
  const jobs = await prisma.schoolRecommendationJob.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      studentName: true,
      score: true,
      preferredMajor: true,
      preferredLocation: true,
      schoolType: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return c.json({ success: true, data: jobs });
});

recommendationRoutes.get("/recommendations/:id", async (c) => {
  const id = c.req.param("id");

  const job = await prisma.schoolRecommendationJob.findUnique({
    where: { id },
  });

  if (!job) {
    return c.json(
      {
        success: false,
        message: "Job rekomendasi tidak ditemukan",
      },
      404,
    );
  }

  return c.json({ success: true, data: job });
});
