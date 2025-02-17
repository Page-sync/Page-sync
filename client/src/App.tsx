import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import interfaces
import { User, BookInfo } from "./globals";

//import components
import PDFViewer from "./components/PDFViewer";
import Library from "./components/Library";
import NoteArea from "./components/NoteArea";

//import style
import "./App.css";

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentBook, setCurrentBook] = useState<BookInfo>();
  const testUrl = "/603d0e327eb2748c8ab1053f_loremipsum.pdf";

  useEffect(() => {
    // pdf url depend on book card be clicked
  }, [pdfUrl]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library setPdfUrl={setPdfUrl} />}></Route>
        <Route
          path="/book"
          // the hard coded url works, but if i use pdfUrl which will be set in bookCard in onClick event, it will apprear as undefined
          element={<PDFViewer />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
