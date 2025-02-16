import { useState } from "react";
import { BookInfo } from "../globals";
interface BookCardProps {
  // use BookInfo
}
const BookCard: React.FC<BookCardProps> = ({}) => {
  return (
    <>
      BookName
      <a href="/book/1" target="_blank" rel="noopener  noreferrer">
        Open the book
      </a>
    </>
  );
};
export default BookCard;
