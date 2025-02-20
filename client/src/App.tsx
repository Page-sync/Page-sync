import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import interfaces
import { User, BookInfo } from "./globals";
// import auth
//import components
import PDFViewer from "./components/PDFViewer";
import Library from "./components/Library";
import UserInfo from "./components/UserInfo";

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentBook, setCurrentBook] = useState<BookInfo>();

  useEffect(() => {
    // pdf url depend on book card be clicked
  }, [pdfUrl]);

  useEffect(() => {
    // pdf url depend on book card be clicked
  }, []);

  return (
    <div className="h-screen w-full flex">
      <BrowserRouter>
        <UserInfo></UserInfo>
        <Routes>
          <Route path="/" element={<Library setPdfUrl={setPdfUrl} />}></Route>
          <Route path="/book" element={<PDFViewer />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
