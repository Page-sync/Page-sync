import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import interfaces
import { User } from "./globals";

//import components
import PDFViewer from "./components/PDFViewer";
import Library from "./components/Library";

//import style
import "./App.css";

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const testUrl = "/603d0e327eb2748c8ab1053f_loremipsum.pdf";

  useEffect(() => {
    setPdfUrl(testUrl);
  }, [pdfUrl]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library />}></Route>
        <Route
          path="/book/:bookId"
          element={<PDFViewer url={testUrl} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
