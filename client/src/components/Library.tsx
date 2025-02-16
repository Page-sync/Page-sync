import { useEffect, useState } from "react";
import BookCard from "./BookCard";
interface LibraryProps {
  // availableBooks Book[]
}
const Library: React.FC<LibraryProps> = () => {
  const sampleBooks = [
    { id: 1, title: "Book 1" },
    { id: 2, title: "Book 2" },
  ];
  useEffect(() => {}, []);
  return (
    <>
      <header>Library</header>
      <div>
        {sampleBooks.map((book) => (
          <BookCard key={book.id}></BookCard>
        ))}
      </div>
    </>
  );
};
export default Library;
