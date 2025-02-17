import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// import component
import NoteArea from "./NoteArea";
// import css component
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
} from "lucide-react";
//import pdfjs
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";
//import worker config file
import { initializePDFWorker } from "../lib/pdf.worker";
initializePDFWorker();
interface PDFViewerProps {}

const PDFViewer: React.FC<PDFViewerProps> = ({}) => {
  const [searchParams] = useSearchParams();
  const bookUrl = searchParams.get("url");
  const bookId = searchParams.get("bookid");
  // canvas emelent used for rendering PDF
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // PDF states
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // load PDF
  useEffect(() => {
    const loadPdf = async () => {
      if (!bookUrl || !bookId) {
        setError("No book url provided");
        return;
      }
      try {
        // during loading, display loading text
        setLoading(true);
        setError(null);
        const decodedUrl = decodeURIComponent(bookUrl);
        console.log(decodedUrl);
        const pdf = await pdfjsLib.getDocument(decodedUrl).promise;
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
  }, [bookUrl]);

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
    const newZoomLevel = Math.max(0.25, Math.min(5, zoomLevel + delta));
    setZoomLevel(newZoomLevel);
  };

  return (
    <>
      <div className="flex-1 flex flex-row">
        <div className="flex-1 flex flex-col">
          {/* PDFViewer */}
          {/* Top bar: */}
          <div className="h-16 border-b flex items-center justify-between px-4">
            {/* Page */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (pdfDoc) {
                    changePage(-1);
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pdfDoc ? (
                <span>
                  Page {currentPage} / {pdfDoc.numPages}
                </span>
              ) : (
                <span>
                  Page {0} / {0}
                </span>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (pdfDoc) {
                    changePage(1);
                  }
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (pdfDoc) {
                    changeZoom(-0.25);
                  }
                }}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <span>{Math.round(zoomLevel * 100)}%</span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (pdfDoc) {
                    changeZoom(0.25);
                  }
                }}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Card className="max-w-4xl mx-auto h-full bg-white shadow-lg">
              <div
                className="
                w-full
                h-full
                flex
                items-center
                justify-center
                text-gray-400"
              >
                {loading ? (
                  <div>Loading PDF</div>
                ) : error ? (
                  <div>{error}</div>
                ) : (
                  <canvas ref={canvasRef} className="pdf-display"></canvas>
                )}
              </div>
            </Card>
          </div>
        </div>
        <div className="w-64 border-l bg-white p-4">
          <NoteArea
            currentPage={currentPage}
            bookId={Number(bookId)}
          ></NoteArea>
        </div>
      </div>
    </>
  );
};

export default PDFViewer;
