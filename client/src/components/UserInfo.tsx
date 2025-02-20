import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import avatar from "../assets/avatar.svg"; // Make sure this path is correct
import { User } from "@/globals";
import ProfileComponent from "./ProfileComponent";
import AuthComponent from "./AuthComponent";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../SupabaseClient";

// Define types for our components
interface UserInfoProps {
  currentUser?: User | null;
}

const UserInfo: React.FC<UserInfoProps> = ({}) => {
  const [showUserWindow, setShowUserWindow] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const toggleUserWindow = () => {
    setShowUserWindow(!showUserWindow);
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.getElementById("user-popup");
      const avatar = document.getElementById("user-avatar-button");
      if (
        popup &&
        avatar &&
        !popup.contains(event.target as Node) &&
        !avatar.contains(event.target as Node) &&
        showUserWindow
      ) {
        setShowUserWindow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserWindow]);

  return (
    <>
      <div className="h-screen w-24 border-r bg-white p-4 flex flex-col">
        {/* User Avatar Button */}
        <nav className="space-y-2">
          <Button
            id="user-avatar-button"
            variant="ghost"
            className="w-full justify-start"
            onClick={toggleUserWindow}
          >
            <Avatar>
              <AvatarImage src={avatar} alt="Profile image" />
            </Avatar>
          </Button>
        </nav>
      </div>

      {/* Popup Overlay */}
      {showUserWindow && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div
            id="user-popup"
            className="bg-white rounded-lg shadow-lg w-96 overflow-hidden"
          >
            {session ? (
              <ProfileComponent session={session} />
            ) : (
              <AuthComponent session={session} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
