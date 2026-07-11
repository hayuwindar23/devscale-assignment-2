import OpenAI from "openai";
import { env } from "./env.js";

export const openai = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function runAiTextPrompt(prompt: string): Promise<string> {
  if (!env.openAiApiKey || env.openAiApiKey.includes("isi_api_key")) {
    return `[MODE DUMMY - OPENAI_API_KEY belum diisi]\n\nPrompt yang seharusnya dikirim ke AI:\n${prompt.slice(0, 2500)}`;
  }

  const response = await openai.chat.completions.create({
    model: env.openAiModel,
    messages: [
      {
        role: "system",
        content: "Kamu adalah asisten rekomendasi sekolah yang menjawab dalam Bahasa Indonesia dengan jelas, objektif, dan terstruktur.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content ?? "Tidak ada hasil dari AI.";
}
