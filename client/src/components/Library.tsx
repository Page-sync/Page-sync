import { useEffect, useState } from "react";
// import component
import BookCard from "./BookCard";
// import interface
import { BookInfo } from "@/globals";
// import helper
import { sendGet } from "@/helpers/requestSender";
// import ui
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Search, Filter } from "lucide-react";
interface LibraryProps {
  // availableBooks Book[]
  setPdfUrl: Function;
}
const Library: React.FC<LibraryProps> = ({}) => {
  const [fetchedBooks, setFetchedBooks] = useState();
  // assume books are fetched here
  const sampleBooks = [
    { id: 1, title: "Book 1", url: "/sample-book-1.pdf" },
    { id: 2, title: "Book 2", url: "/sample-book-2.pdf" },
  ];
  const books = Array(8).fill({
    title: "Sample Book",
    author: "Author Name",
    cover: "/api/placeholder/200/300",
    url: "/sample-book-1.pdf",
  });
  // get books

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await sendGet("/books");
        if (response?.success) {
          setFetchedBooks(response.result);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, []);
  return (
    <>
      <div className="flex h-screen">
        {/* Library */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="h-16 border-b bg-white px-4 flex items-center gap-4">
            <div className="flex-1 max-w-md flex items-center gap-2">
              <Input placeholder="Search books..." className="w-full" />
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Books Grid Area */}
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="grid grid-cols-4 gap-6">
              {books.map((book, idx) => (
                <BookCard key={idx} bookInfo={book}></BookCard>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Book Info */}
        <div className="w-80 border-l bg-white p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Book Information</h2>

            {/* Selected Book Preview */}
            <Card className="p-4">
              <div className="aspect-[2/3] bg-gray-100 mb-4">
                <img
                  src="/api/placeholder/240/360"
                  alt="Selected book cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Book Title</h3>
                <p className="text-sm text-gray-500">Author Name</p>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
      </div>
    </>
  );
};
export default Library;
