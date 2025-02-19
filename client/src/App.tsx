import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { sendGet } from "./helpers/requestSender";
// import interfaces
import { User, BookInfo } from "./globals";
//import components
import PDFViewer from "./components/PDFViewer";
import Library from "./components/Library";
import UserInfo from "./components/UserInfo";

//import style
import "./App.css";

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentBook, setCurrentBook] = useState<BookInfo>();
  const testUrl = "/603d0e327eb2748c8ab1053f_loremipsum.pdf";

  useEffect(() => {
    // pdf url depend on book card be clicked
  }, [pdfUrl]);

  useEffect(() => {
    // pdf url depend on book card be clicked
    // const tester = async () => {
    //   const result = await sendGet("");
    //   console.log(result);
    // };
    // tester();
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
