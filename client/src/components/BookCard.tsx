import { useEffect, useRef, useState } from "react";
import { BookInfo } from "../globals";

import {
  Card,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
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
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    // Construct Google Books cover URL
    const openLibraryCover = `https://covers.openlibrary.org/b/isbn/${bookInfo.isbn}-L.jpg`;
    setImageUrl(defaultCover);
  }, [bookInfo]);

  return (
    <div>
      <Card
        className="flex flex-col p-4 hover:shadow-lg transition-shadow h-48 w-24 overflow-auto"
        onClick={() => {
          if (clickRef.current) {
            clickRef.current.click();
          }
        }}
      >
        <div className="aspect-[2/3] bg-gray-200 mb-3">
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
          <img src={imageUrl} alt={bookInfo.title} crossOrigin="anonymous" />
        </div>
        <h3 className="font-medium text-sm">{bookInfo.title}</h3>
        <p className="text-sm text-gray-500">{bookInfo.authors}</p>
      </Card>
    </div>
  );
};
export default BookCard;
