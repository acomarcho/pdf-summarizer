import * as fs from "fs";
import { PDFDocument } from "pdf-lib";

export class PdfService {
  async extractText(
    file: Express.Multer.File,
    pageStart?: number,
    pageEnd?: number
  ): Promise<{ text: string; totalPages: number }> {
    try {
      const dataBuffer = fs.readFileSync(file.path);

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(dataBuffer);
      const totalPages = pdfDoc.getPageCount();

      // Calculate page range
      const start = Math.max(0, (pageStart || 1) - 1);
      const end = Math.min((pageEnd || totalPages) - 1, totalPages - 1);

      // Create a new document with selected pages
      const subsetPdf = await PDFDocument.create();
      const pages = await subsetPdf.copyPages(
        pdfDoc,
        Array.from({ length: end - start + 1 }, (_, i) => start + i)
      );

      pages.forEach((page) => subsetPdf.addPage(page));

      // Extract text from the subset
      const text = await this.extractTextFromPdf(subsetPdf);

      return {
        text,
        totalPages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to extract PDF text: ${error.message}`);
      } else {
        throw new Error("Failed to extract PDF text: Unknown error");
      }
    } finally {
      // Clean up uploaded file
      fs.unlinkSync(file.path);
    }
  }

  private async extractTextFromPdf(pdfDoc: PDFDocument): Promise<string> {
    // Convert to buffer for pdf-parse to read
    const pdfBytes = await pdfDoc.save();
    const pdf = require("pdf-parse");
    const data = await pdf(pdfBytes);
    return data.text;
  }
}
