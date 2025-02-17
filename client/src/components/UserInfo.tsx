import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
interface UserInfoProps {
  // use NoteInfo
}
const UserInfo: React.FC<UserInfoProps> = ({}) => {
  useEffect(() => {
    console.log();
  }, []);
  return (
    <div className="h-screen w-24 border-r bg-white p-4 flex flex-col">
      {/* Navigation Menu */}
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </nav>
    </div>
  );
};
export default UserInfo;
