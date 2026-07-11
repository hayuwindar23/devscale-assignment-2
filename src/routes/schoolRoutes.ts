import { Hono } from "hono";
import { katalogSekolah, asumsiPenerimaanSekolah } from "../data/katalogSekolah.js";

export const schoolRoutes = new Hono();

schoolRoutes.get("/schools", (c) => {
  return c.json({
    success: true,
    assumption: asumsiPenerimaanSekolah,
    data: katalogSekolah,
  });
});
