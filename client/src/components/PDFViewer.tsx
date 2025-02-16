import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { bookId } = useParams();
  // canvas emelent used for rendering PDF
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // load PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        // during loading, display loading text
        setLoading(true);
        setError(null);

        const pdf = await pdfjsLib.getDocument(url).promise;
        setPdfDoc(pdf);
        await renderPage(pdf);
      } catch (error) {
        console.error("Error during loading pdf", error);
        setError("Error during loading pdf");
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
    console.log(loading);
    console.log(bookId);
  }, [url]);

  // rerender if current page or zoomLevel changes
  useEffect(() => {
    const handleRenderPage = async () => {
      renderPage();
    };
    if (pdfDoc) {
      handleRenderPage();
    }
  }, [currentPage, zoomLevel, loading, error]);

  const renderPage = async (doc: PDFDocumentProxy = pdfDoc!) => {
    if (!canvasRef.current) {
      return;
    }
    const page = await doc.getPage(currentPage);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Cannot get canvas context");
      return;
    }
    const parent = canvas.parentElement;
    //fit parent size
    const baseScale = parent
      ? parent.clientWidth / page.getViewport({ scale: 1 }).width
      : 1;
    const scale = Math.min(baseScale * zoomLevel, 3);
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
  };
  // handle panle changes
  const changePage = async (offset: number) => {
    const newPage = currentPage + offset;
    if (pdfDoc && newPage >= 1 && newPage <= pdfDoc.numPages) {
      setCurrentPage(newPage);
    }
  };
  const changeZoom = async (delta: number) => {
    setZoomLevel((prevzoomLevel) => {
      const newZoomLevel = Math.max(0.25, Math.min(5, prevzoomLevel + delta));
      return newZoomLevel;
    });
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
              {/* change page */}
              <div className="page-panle">
                <button
                  onClick={() => {
                    changePage(-1);
                  }}
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
                  className="panle-btn"
                >
                  Next
                </button>
              </div>
              {/* zoom */}
              <div className="zoom-panle">
                <button
                  onClick={() => {
                    changeZoom(-0.25);
                  }}
                  className="panle-btn"
                >
                  Zoom Out
                </button>
                <span className="zoom-info">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => {
                    changeZoom(0.25);
                  }}
                  className="panle-btn"
                >
                  Zoom In
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                  }}
                  className="panle-btn"
                >
                  Reset Zoom
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PDFViewer;
