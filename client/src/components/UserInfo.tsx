import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import avatar from "../assets/avatar.svg";
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
            <AvatarImage src={avatar} alt="Profile image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </nav>
    </div>
  );
};
export default UserInfo;
