import { OpenAI } from "openai";
import { chunk } from "../utils/textUtils";

export class SummaryService {
  private openai: OpenAI;
  private chunkSize: number = 4000; // Adjust based on token limits

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarize(text: string, minParagraphs: number): Promise<string> {
    // Split text into chunks
    const chunks = chunk(text, this.chunkSize);

    // First iteration: Summarize each chunk
    const initialSummaries = await Promise.all(
      chunks.map((chunk) => this.summarizeChunk(chunk))
    );

    // Combine summaries
    const combinedSummary = initialSummaries.join("\n\n");

    // Second iteration: Refine the combined summary
    const finalSummary = await this.refineSummary(
      combinedSummary,
      minParagraphs
    );

    return finalSummary;
  }

  private async summarizeChunk(text: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a precise summarizer. Create a detailed summary of the following text.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content || "";
  }

  private async refineSummary(
    text: string,
    minParagraphs: number
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Create a detailed, coherent summary with at least ${minParagraphs} paragraphs. Maintain key information and ensure logical flow.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content || "";
  }
}
