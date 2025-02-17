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

  const encodeBookdUrl = encodeURIComponent(bookInfo.url);
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
          <a
            ref={clickRef}
            href={`/book/?url=${encodeBookdUrl}&bookid=${bookInfo.id}`}
            target="_blank"
            rel="noopener  noreferrer"
          ></a>
          <img
            src={bookInfo.cover}
            alt={bookInfo.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-medium text-sm">{bookInfo.title}</h3>
        <p className="text-sm text-gray-500">{bookInfo.author}</p>
      </Card>
    </div>
  );
};
export default BookCard;
