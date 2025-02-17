import { useEffect, useState } from "react";
import BookCard from "./BookCard";
interface LibraryProps {
  // availableBooks Book[]
  setPdfUrl: Function;
}
const Library: React.FC<LibraryProps> = ({}) => {
  // assume books are fetched here
  const sampleBooks = [
    { id: 1, title: "Book 1", url: "/sample-book-1.pdf" },
    { id: 2, title: "Book 2", url: "/sample-book-2.pdf" },
  ];
  useEffect(() => {}, []);
  return (
    <>
      <header>Library</header>
      <div>
        {sampleBooks.map((book) => (
          <BookCard key={book.id} bookInfo={book}></BookCard>
        ))}
      </div>
    </>
  );
};
export default Library;
