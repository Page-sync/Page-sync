import { useEffect, useRef, useState } from "react";
// import component
import BookCard from "./BookCard";
import SearchBar from "./SearchBar";
// import interface
import { BookInfo } from "@/globals";
// import helper
import { sendGet } from "@/helpers/requestSender";
// import ui
import { Card } from "./ui/card";
import defaultCover from "../assets/book-cover.svg";
interface LibraryProps {
  // availableBooks Book[]
  setPdfUrl: Function;
}
const Library: React.FC<LibraryProps> = ({}) => {
  const [fetchedBooks, setFetchedBooks] = useState<BookInfo[]>();
  const [currentBook, setCurrentBook] = useState<BookInfo | null>(null);
  const currentBookClickRef = useRef<HTMLAnchorElement>(null);
  // assume books are fetched here
  // get books
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await sendGet("/book/random");
        if (response?.success) {
          console.log(response.result);
          setFetchedBooks(response.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, []);

  useEffect(() => {
    console.log(currentBook);
  }, [currentBook]);
  return (
    <>
      <div className="flex h-screen">
        {/* Library */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <SearchBar
            currentBook={currentBook}
            setCurrentBook={setCurrentBook}
          />
          {/* Books Grid Area */}
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="grid grid-cols-4 gap-6">
              {fetchedBooks &&
                fetchedBooks.map((book, idx) => (
                  <BookCard key={idx} bookInfo={book}></BookCard>
                ))}
            </div>
          </div>
        </div>
        {/* Right - Book Info */}
        {currentBook && (
          <div className="w-80 border-l bg-white p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Book Information</h2>

              {/* Selected Book Preview */}
              <Card
                className="p-4"
                onClick={() => {
                  if (currentBookClickRef.current) {
                    currentBookClickRef.current.click();
                  }
                }}
              >
                <div className="aspect-[2/3] bg-gray-100 mb-4">
                  <div className="aspect-[2/3] bg-gray-200 mb-3">
                    {currentBook.isbn !== null ? (
                      <a
                        ref={currentBookClickRef}
                        href={`/book/?isbn=${currentBook.isbn}&id=${currentBook.id}`}
                        target="_blank"
                        rel="noopener  noreferrer"
                      ></a>
                    ) : (
                      <div>No isbn fund</div>
                    )}
                    <img
                      src={defaultCover}
                      alt={currentBook.title}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Book Title</h3>
                  <p className="text-sm text-gray-500">Author Name</p>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </Card>

              {/* Additional Book Info */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Publisher</p>
                  <p className="text-sm text-gray-600">Publisher Name</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Publication Date</p>
                  <p className="text-sm text-gray-600">January 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">ISBN</p>
                  <p className="text-sm text-gray-600">978-3-16-148410-0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Library;
