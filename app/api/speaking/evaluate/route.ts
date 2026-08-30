import { google } from "@ai-sdk/google";
import { APICallError, RetryError, generateText, Output } from "ai";
import { z } from "zod";

const evaluationSchema = z.object({
  transcript: z.string().describe("Exact transcript of what the student said, in French. If unintelligible, describe what's audible."),
  overall: z.number().min(0).max(10).describe("Overall speaking score out of 10"),
  scores: z.object({
    pronunciation: z.number().min(0).max(10).describe("Clarity and accuracy of French pronunciation, judged from the actual audio"),
    fluency: z.number().min(0).max(10).describe("Smoothness, pacing, hesitation and filler words"),
    grammar: z.number().min(0).max(10),
    vocabulary: z.number().min(0).max(10).describe("Range and precision of vocabulary used"),
    sentenceStructure: z.number().min(0).max(10),
    coherence: z.number().min(0).max(10).describe("How logically the answer is organized and how well it addresses the prompt"),
  }),
  wellDone: z.string().describe("One or two encouraging sentences on what the student did well, specific to this answer"),
  improve: z.string().describe("One or two sentences on the single most useful thing to improve next"),
  corrections: z
    .array(
      z.object({
        said: z.string().describe("A short phrase the student actually said with an error"),
        better: z.string().describe("The corrected version of that phrase"),
        explanation: z.string().describe("A simple, encouraging explanation of the correction"),
      })
    )
    .max(4)
    .describe("The most important corrections only — grammar, vocabulary, unnatural expressions, connectors, or filler words"),
  improvedAnswer: z.string().describe("A short, natural, stronger French version of the student's overall answer"),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");
    const prompt = formData.get("prompt");

    if (!(audio instanceof File) || typeof prompt !== "string" || !prompt) {
      return new Response("Missing audio or prompt", { status: 400 });
    }

    const buffer = Buffer.from(await audio.arrayBuffer());

    const { output } = await generateText({
      model: google("gemini-3.5-flash-lite"),
      system:
        "You are an experienced, encouraging examiner for French oral proficiency (TEF/TCF/DELF style). " +
        "Listen carefully to the student's recorded answer and evaluate their spoken French — including actual " +
        "pronunciation clarity and accuracy as heard in the audio, not just the words used. Be specific and " +
        "constructive. Keep all written feedback in English except the French examples themselves.",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `The student was asked, in French: "${prompt}"\n\nListen to their recorded answer and evaluate it.` },
            { type: "file", mediaType: audio.type || "audio/webm", data: buffer },
          ],
        },
      ],
      output: Output.object({ schema: evaluationSchema }),
    });

    return Response.json(output);
  } catch (error) {
    const cause = RetryError.isInstance(error) ? error.lastError : error;
    if (APICallError.isInstance(cause) && cause.statusCode === 429) {
      return new Response("Rate limited", { status: 429 });
    }
    console.error(error);
    return new Response("Evaluation failed", { status: 500 });
  }
}
