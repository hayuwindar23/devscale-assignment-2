import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "./lib/env.js";
import { recommendationRoutes } from "./routes/recommendationRoutes.js";
import { schoolRoutes } from "./routes/schoolRoutes.js";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "API Rekomendasi Sekolah SMA/SMK DI Yogyakarta berjalan",
    endpoints: [
      "GET /api/schools",
      "POST /api/recommendations",
      "GET /api/recommendations",
      "GET /api/recommendations/:id",
    ],
  });
});

app.route("/api", schoolRoutes);
app.route("/api", recommendationRoutes);

serve(
  {
    fetch: app.fetch,
    port: env.port,
  },
  (info) => {
    console.log(`API berjalan di http://localhost:${info.port}`);
  },
);
