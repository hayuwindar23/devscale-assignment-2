import { Queue } from "bullmq";
import { env } from "../lib/env.js";

export const redisConnection = {
  host: env.redisHost,
  port: env.redisPort,
  maxRetriesPerRequest: null,
};

export const recommendationQueue = new Queue("school-recommendation-queue", {
  connection: redisConnection,
});
