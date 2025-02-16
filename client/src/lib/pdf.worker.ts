// worker initialization
import { GlobalWorkerOptions } from "pdfjs-dist";
// for production:
import PDFWorker from "pdfjs-dist/build/pdf.worker.min?url";
// for dev:
// import PDFWorker from "pdfjs-dist/build/pdf.worker?url";
export const initializePDFWorker = () => {
  GlobalWorkerOptions.workerSrc = PDFWorker;
};
