import { useEffect, useRef, useState } from "react";
import { BookInfo } from "../globals";

import { Card } from "@mui/material";
import defaultCover from "../assets/book-cover.svg";
interface BookCardProps {
  // use BookInfo
  bookInfo: BookInfo;
}
const BookCard: React.FC<BookCardProps> = ({ bookInfo }) => {
  useEffect(() => {
    console.log(bookInfo.thumbnail);
  });
  const clickRef = useRef<HTMLAnchorElement>(null);
  // const encodeBookdUrl = encodeURIComponent(bookInfo.url);
  const [imageUrl, setImageUrl] = useState<string>();
  // const [isLoading, setIsLoading] = useState<boolean>();
  // const [error, setError] = useState<string>();

  useEffect(() => {
    // Construct Google Books cover URL
    setImageUrl(defaultCover);
  }, [bookInfo]);

  return (
    <div>
      <Card
        className="flex flex-col p-4 hover:shadow-lg transition-shadow h-48 w-36 overflow-auto"
        onClick={() => {
          if (clickRef.current) {
            clickRef.current.click();
          }
        }}
      >
        <div className="aspect-[2/3] bg-gray-200 mb-3 relative">
          {bookInfo.isbn !== null ? (
            <a
              ref={clickRef}
              href={`/book/?isbn=${bookInfo.isbn}&id=${bookInfo.id}`}
              target="_blank"
              rel="noopener  noreferrer"
            ></a>
          ) : (
            <div>No isbn fund</div>
          )}
          <span className="absolute inset-x-0 top-0 p-4 text-gray-800 font-medium z-10 bg-white/80">
            {bookInfo.title}
          </span>
          <img
            src={imageUrl}
            alt={bookInfo.title}
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-medium text-sm">{bookInfo.title}</h3>
        <p className="text-sm text-gray-500">{bookInfo.authors}</p>
      </Card>
    </div>
  );
};
export default BookCard;
