import { useEffect, useRef, useState } from "react";
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
import { Search, Filter, Component } from "lucide-react";
interface SearchBarProps {
  // availableBooks Book[]
  currentBook: BookInfo | null;
  setCurrentBook: Function;
}

const SearchBar: React.FC<SearchBarProps> = ({ setCurrentBook }) => {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (searchRef.current) {
      const isbn = searchRef.current.value;
      console.log(isbn);
      //   const result = await sendGet("/book/info", { isbn: isbn });
      setCurrentBook((prev: BookInfo) => ({ ...prev, isbn: isbn }));
    }
  };
  return (
    <div className="h-16 border-b bg-white px-4 flex items-center gap-4">
      <div className="flex-1 max-w-md flex items-center gap-2">
        <Input
          placeholder="Search books..."
          className="w-full"
          ref={searchRef}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};
export default SearchBar;
