import { useRef, useState } from "react";
import { BookInfo } from "../globals";
interface BookCardProps {
  // use BookInfo
  bookInfo: BookInfo;
}
const BookCard: React.FC<BookCardProps> = ({ bookInfo }) => {
  const clickRef = useRef(null);

  const encodeBookdUrl = encodeURIComponent(bookInfo.url);
  return (
    <div className="bookcard">
      BookName
      <a
        ref={clickRef}
        href={`/book/?url=${encodeBookdUrl}&bookid=${bookInfo.id}`}
        target="_blank"
        rel="noopener  noreferrer"
        onClick={() => {
          console.log(bookInfo);
        }}
      >
        <button>Open the book</button>
      </a>
    </div>
  );
};
export default BookCard;
