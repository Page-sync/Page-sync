import { useEffect, useState } from "react";
// import interfaces
import { User } from "./globals";

//import components
import PDFViewer from "./components/PDFViewer";
//import style
import "./App.css";

function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const testUrl = "/603d0e327eb2748c8ab1053f_loremipsum.pdf";

  useEffect(() => {
    setPdfUrl(testUrl);
  }, [pdfUrl]);
  return (
    <>
      <p>helloworld</p>
      <div>
        <PDFViewer
          url={pdfUrl ? pdfUrl : `../public/Lorem_ipsum.pdf`}
        ></PDFViewer>
      </div>
    </>
  );
}

export default App;
