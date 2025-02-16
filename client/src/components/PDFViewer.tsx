import { useEffect, useRef, useState } from "react";
//import pdfjs
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";
//import worker config file
import { initializePDFWorker } from "../lib/pdf.worker";
initializePDFWorker();
interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadPdf = async () => {
      try {
        // during loading, display loading text
        setLoading(true);
        setError(null);

        const pdf = await pdfjsLib.getDocument(url).promise;
        setPdfDoc(pdf);
        await renderPage(1, pdf);
      } catch (error) {
        console.error("Error during loading pdf", error);
        setError("Error during loading pdf");
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
    console.log(loading);
  }, [url]);
  //pdfDoc! : not null assertino

  const renderPage = async (
    pageNumber: number,
    doc: PDFDocumentProxy = pdfDoc!
  ) => {
    //
    if (!canvasRef.current) {
      return;
    }
    const page = await doc.getPage(pageNumber);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Cannot get canvas context");
      return;
    }
    const parent = canvas.parentElement;
    const scale = parent
      ? Math.min(parent.clientWidth / page.getViewport({ scale: 1 }).width, 1.5)
      : 1.5;
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    console.log(pdfDoc);
  };

  const changePage = async (offset: number) => {
    const newPage = currentPage + offset;
    if (pdfDoc && newPage >= 1 && newPage <= pdfDoc.numPages) {
      await renderPage(newPage);
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <p>PDFViewer</p>
      {loading ? (
        <div>Loading PDF</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="pdfviewer">
          <div className="canvas-container">
            <canvas ref={canvasRef} className="pdf-display"></canvas>
          </div>
          {pdfDoc && (
            <div className="panle">
              <button
                onClick={() => {
                  changePage(-1);
                }}
                disabled={currentPage <= 1}
                className="panle-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} / {pdfDoc.numPages}
              </span>
              <button
                onClick={() => {
                  changePage(1);
                }}
                disabled={currentPage >= pdfDoc.numPages}
                className="panle-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PDFViewer;
