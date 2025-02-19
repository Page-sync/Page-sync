import { useRef, useState } from "react";
import { BookInfo } from "../globals";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
interface BookCardProps {
  // use BookInfo
  bookInfo: BookInfo;
}
const BookCard: React.FC<BookCardProps> = ({ bookInfo }) => {
  const clickRef = useRef<HTMLAnchorElement>(null);
  // const encodeBookdUrl = encodeURIComponent(bookInfo.url);
  return (
    <div>
      <Card
        className="flex flex-col p-4 hover:shadow-lg transition-shadow"
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
              href={`/book/?isbn=${bookInfo.isbn}&bookid=${bookInfo.id}`}
              target="_blank"
              rel="noopener  noreferrer"
            ></a>
          ) : (
            <div>No isbn fund</div>
          )}

          {/*  href={`/book/?url=${bookInfo.isbn}&bookid=${bookInfo.id}`} */}
          {/* TODO: onClick: query api for that url, and set url in href params , use isbn in viewer, query endpoint in viewer, then load url in viewer */}
          <img
            src={bookInfo.thumbnail}
            alt={bookInfo.title}
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
