"use server";

import { GoogleGenAI } from "@google/genai";
import { requireAuth } from "@/lib/auth/session";
import { getDashboardData } from "@/server/queries/dashboard";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSalesAction() {
  const session = await requireAuth();

  if (!process.env.GEMINI_API_KEY) {
    return { error: "Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file." };
  }

  try {
    const data = await getDashboardData(session.userId);

    const prompt = `
      You are an expert financial AI assistant for a B2B SaaS application called Invoice Flow.
      Analyze the following dashboard data and provide a concise, 2-3 sentence financial insight or recommendation.
      Focus on actionable advice regarding outstanding invoices, revenue trends, or top performing items.
      Do not use formatting like bolding or bullet points. Keep it professional and direct.

      Data:
      Total Outstanding: $${data.stats.unpaidAmount / 100}
      Amount Overdue: $${data.stats.overdueAmount / 100} (from ${data.stats.overdueCount} invoices)
      Total Collected: $${data.stats.paidAmount / 100}
      Top Items: ${data.topItems.map(i => i.name).join(", ")}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (response.text) {
      return { text: response.text };
    } else {
      return { error: "Failed to generate insights." };
    }
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { error: "An error occurred while analyzing sales data." };
  }
}
