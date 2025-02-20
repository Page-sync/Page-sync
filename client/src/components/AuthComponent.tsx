import React, { useState } from "react";
import { Button } from "./ui/button";
import { User } from "@/globals";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../SupabaseClient";

const AuthComponent: React.FC<{
  session: Session | null;
}> = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await handleLogin();
      } else if (!isLogin) {
        await handleSignup();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      await createBackendSession(
        { userid: data.user.id, email: email },
        data.session
      );
    }
  };
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await createUserInDatabase({
        userid: data.user.id,
        email: data.user.email as string,
      });
    }
    if (data.session && data.user) {
      await createBackendSession(
        {
          userid: data.user.id,
          email: data.user.email as string,
        },
        data.session
      );
    } else {
      // Show confirmation message
      setError("Please check your email to confirm your account");
    }
  };

  const createBackendSession = async (user: User, supabaseSession: Session) => {
    try {
      // cab226023@gmail.com mycodemail979@gmail.com
      const response = await fetch(`${BASE_URL}/auth/set-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          accessToken: supabaseSession.access_token,
        }),
        credentials: "include", //
      });
      if (!response.ok) {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      console.error("Session creation error:", error);
      throw new Error("Could not create session on server");
    }
  };
  // create user in database
  const createUserInDatabase = async (user: User) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (!response.ok) {
        console.log(response.status);
      }
    } catch (error) {
      console.error("User creation error:", error);
      throw new Error("Could not create user profile");
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Login"}
        </Button>
      </div>
      {loading && (
        <div>
          <span>On loading...</span>
        </div>
      )}
      {error && (
        <div>
          <span>An error happend...</span>
        </div>
      )}
    </div>
  );
};
export default AuthComponent;
