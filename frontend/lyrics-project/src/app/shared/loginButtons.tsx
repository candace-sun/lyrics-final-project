"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginButtons() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  let username = "";
  if (typeof window !== "undefined") {
    username = localStorage.getItem("username") || "";
  }

  useEffect(() => {
    if (username && username != "") {
      try {
        fetch(`http://127.0.0.1:5000/is_logged_in/${username}`)
          .then((response) => response.text())
          .then((data) => (data === "True" ? setLoggedIn(true) : {}));
      } catch (error) {
        console.log(error);
      }
    }
  }, [username]);

  function login() {
    router.push("/login");
  }

  async function logout() {
    localStorage.removeItem("username");
    location.reload();
    // if (username && username != "") {
    //   const response = await fetch(
    //     `http://127.0.0.1:5000/is_logged_in/${username}`,
    //     {
    //       method: "GET",
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );

    //   if (response.ok) {
    //     const res = await response.text();
    //     if (res === "True") {
    //       setLoggedIn(true);
    //     }
    //   } else {
    //     // Handle errors
    //   }
    // }
  }

  return (
    <span className="m-3 text-right">
      {loggedIn ? (
        <>
          Welcome{" "}
          <Link href="/profile" className="font-bold">
            {username}
          </Link>
          !{"\t"}
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline ml-2"
            onClick={logout}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
          onClick={login}
        >
          Login
        </button>
      )}
    </span>
  );
}
