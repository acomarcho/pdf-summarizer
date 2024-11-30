import { useState, useRef } from "react";
import "./App.css";

interface SummaryResponse {
  summary: string;
  paragraphCount: number;
  pagesProcessed: {
    start: number;
    end: number;
    total: number;
  };
}

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [minParagraphs, setMinParagraphs] = useState(3);
  const [pageStart, setPageStart] = useState<number | undefined>();
  const [pageEnd, setPageEnd] = useState<number | undefined>();
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!pdfFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("minParagraphs", minParagraphs.toString());
    if (pageStart) formData.append("pageStart", pageStart.toString());
    if (pageEnd) formData.append("pageEnd", pageEnd.toString());

    try {
      const response = await fetch("http://localhost:3000/summarize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get summary");
      }

      const data: SummaryResponse = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get summary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="pdf-viewer">
        {pdfUrl ? (
          <iframe src={pdfUrl} title="PDF Viewer" />
        ) : (
          <div className="pdf-placeholder">Upload a PDF to view it here</div>
        )}
      </div>

      <div className="controls">
        <div className="upload-section">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button onClick={() => fileInputRef.current?.click()}>
            Upload PDF
          </button>
          {pdfFile && <span className="filename">{pdfFile.name}</span>}
        </div>

        <div className="input-group">
          <label>
            Minimum Paragraphs:
            <input
              type="number"
              value={minParagraphs}
              onChange={(e) => setMinParagraphs(Number(e.target.value))}
              min="1"
            />
          </label>

          <label>
            Start Page:
            <input
              type="number"
              value={pageStart || ""}
              onChange={(e) =>
                setPageStart(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              min="1"
            />
          </label>

          <label>
            End Page:
            <input
              type="number"
              value={pageEnd || ""}
              onChange={(e) =>
                setPageEnd(e.target.value ? Number(e.target.value) : undefined)
              }
              min="1"
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!pdfFile || isLoading}
          className="summarize-button"
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>

        <div className="summary">
          {summary.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
