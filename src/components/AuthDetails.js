// src/components/AuthDetails.js
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function AuthDetails() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <p className="text-gray-300">Welcome, {user.email}!</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </>
      ) : (
        <p className="text-gray-300">Signed Out</p>
      )}
    </div>
  );
}

export default AuthDetails;