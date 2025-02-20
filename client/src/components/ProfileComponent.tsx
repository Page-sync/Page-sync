import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import avatar from "../assets/avatar.svg"; // Make sure this path is correct
import { Session } from "@supabase/supabase-js";
import { supabase } from "../SupabaseClient";

const ProfileComponent: React.FC<{
  session: Session | null;
}> = ({ session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  console.log(session);

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={avatar} alt={session?.user.email} />
        </Avatar>
        <h2 className="text-2xl font-bold">{""}</h2>
        <p className="text-gray-500">{""}</p>
      </div>

      <div className="space-y-4">
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full">
          Settings
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
export default ProfileComponent;
