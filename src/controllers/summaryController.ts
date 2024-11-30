import { Request, Response } from "express";
import { PdfService } from "../services/pdfService";
import { SummaryService } from "../services/summaryService";

export class SummaryController {
  private pdfService: PdfService;
  private summaryService: SummaryService;

  constructor() {
    this.pdfService = new PdfService();
    this.summaryService = new SummaryService();
  }

  async summarizePdf(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No PDF file provided" });
        return;
      }

      const minParagraphs = parseInt(req.body.minParagraphs) || 3;
      const pageStart = req.body.pageStart
        ? parseInt(req.body.pageStart)
        : undefined;
      const pageEnd = req.body.pageEnd ? parseInt(req.body.pageEnd) : undefined;

      // Validate page numbers if provided
      if (pageStart && pageStart < 1) {
        res.status(400).json({ error: "pageStart must be greater than 0" });
        return;
      }
      if (pageEnd && pageStart && pageEnd < pageStart) {
        res.status(400).json({
          error: "pageEnd must be greater than or equal to pageStart",
        });
        return;
      }

      // Extract text from PDF
      const { text, totalPages } = await this.pdfService.extractText(
        req.file,
        pageStart,
        pageEnd
      );

      // Generate summary
      const summary = await this.summaryService.summarize(text, minParagraphs);

      // Count paragraphs in summary
      const paragraphCount = summary.split("\n\n").length;

      res.json({
        summary,
        paragraphCount,
        pagesProcessed: {
          start: pageStart || 1,
          end: pageEnd || totalPages,
          total: totalPages,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
