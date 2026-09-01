import { google } from "@ai-sdk/google";
import { APICallError, RetryError, generateText } from "ai";
import { profile } from "@/lib/profileData";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const context = typeof body?.context === "string" ? body.context.trim() : "";

    const { text } = await generateText({
      model: google("gemini-3.5-flash-lite"),
      system:
        `You write a short 'Today's Note' a French teacher leaves for their student, ${profile.name}, on their ` +
        "dashboard — one or two warm, specific-sounding sentences (encouragement, an observation, or a quick " +
        `nudge), in English. Never generic filler like 'keep up the good work'. Only use the name ${profile.name} ` +
        "if addressing the student by name — never invent or guess a different name. Reply with ONLY the note text, no quotes, no preamble.",
      prompt: context
        ? `Write the note based on this recent activity:\n${context}`
        : "Write a short, encouraging note for a French-learning student — no specific recent activity to reference, so keep it general but still warm and concrete.",
    });

    return Response.json({ text: text.trim() });
  } catch (error) {
    const cause = RetryError.isInstance(error) ? error.lastError : error;
    if (APICallError.isInstance(cause) && cause.statusCode === 429) {
      return new Response("Rate limited — try again in a moment.", { status: 429 });
    }
    console.error(error);
    return new Response("Couldn't write a note right now.", { status: 500 });
  }
}
