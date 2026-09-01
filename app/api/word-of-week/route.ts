import { google } from "@ai-sdk/google";
import { APICallError, RetryError, generateText, Output } from "ai";
import { z } from "zod";

const wordSchema = z.object({
  word: z.string().describe("The French word or short phrase itself, exactly as it should be displayed"),
  meaning: z.string().describe('A short, gloss-style English meaning — a few words, not a sentence (e.g. "however · yet")'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const word = typeof body?.word === "string" ? body.word.trim() : "";

    const { output } = await generateText({
      model: google("gemini-3.5-flash-lite"),
      system:
        "You help a French teacher pick a 'Word of the Week' to show a French-learning student on their dashboard. " +
        "Keep the meaning short and gloss-style — a few words separated by · if there are multiple senses, never a full sentence.",
      prompt: word
        ? `Give the short English meaning of this French word or phrase: "${word}"`
        : "Pick one useful French word, connector, or short idiom worth an intermediate (B1/B2) learner knowing this week — " +
          "vary the type each time (don't default to common connectors every time) — and give its short English meaning.",
      output: Output.object({ schema: wordSchema }),
    });

    return Response.json(output);
  } catch (error) {
    const cause = RetryError.isInstance(error) ? error.lastError : error;
    if (APICallError.isInstance(cause) && cause.statusCode === 429) {
      return new Response("Rate limited — try again in a moment.", { status: 429 });
    }
    console.error(error);
    return new Response("Couldn't generate a word right now.", { status: 500 });
  }
}
