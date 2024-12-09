"use client";

import { supabase_client } from "../../api/supabase_client";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const router = useRouter();

  const handleSignUp = async () => {
    const { data, error } = await supabase_client.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      setUser(data.user);
      router.push("./challenges");
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase_client.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      setUser(data.user);
      router.push("./challenges");
    }
  };

  const handleGuestAccess = () => {
    setShowDisclaimer(true);
  };

  const confirmGuestAccess = () => {
    setShowDisclaimer(false);
    router.push("./challenges");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-900 flex flex-col items-center justify-center">
      {!user ? (
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl mb-4">Login or Sign Up</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Sign Up
          </button>
          <button
            onClick={handleGuestAccess}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-4"
          >
            Continue as Guest
          </button>
        </div>
      ) : null}

      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 w-[50%] rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Guest Access Disclaimer</h2>
            <p className="mb-4">
              As a guest, some features may be unavailable. For example, your progress can only be saved locally, you will not be able to join a teacher's class, and others will not be able to view your progress if you allow access.
              For full access, please create an account.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmGuestAccess}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
