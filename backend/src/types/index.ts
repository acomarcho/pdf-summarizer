export interface SummaryRequest {
  minParagraphs: number;
  file: Express.Multer.File;
  pageStart?: number;
  pageEnd?: number;
}

export interface SummaryResponse {
  summary: string;
  paragraphCount: number;
  pagesProcessed: {
    start: number;
    end: number;
    total: number;
  };
} 