"use client";

import LoginButtons from "../shared/loginButtons";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import Link from "next/link";
import { FolderIcon } from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/24/solid";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  let username = "";
  if (typeof window !== "undefined") {
    username = localStorage.getItem("username") || "";
  }

  useEffect(() => {
    if (username && username != "") {
      try {
        fetch(`http://127.0.0.1:5000/is_logged_in/${username}`)
          .then((response) => response.text())
          .then((data) => {
            if (data === "True") {
              setLoggedIn(true);

              try {
                fetch(`http://127.0.0.1:5000/get_email/${username}`)
                  .then((response) => response.text())
                  .then((data) => {
                    if (data !== "False") {
                      setEmail(data);
                    }
                  });
              } catch (error) {
                console.log(error);
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [username, email]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      fetch("http://127.0.0.1:5000/update_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      })
        .then((response) => response.text())
        .then((data) => {
          if (data === "True") {
            alert("Updated!");
            setEmail((email || "").toString());
          } else {
            alert("Error, please try again");
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="m-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex justify-start gap-3">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow">
              <Link href="/search">Go to Search</Link>
            </button>

            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow inline-flex items-center group justify-self-start">
              <FolderIcon className="w-4 h-4 mr-2 group-hover:hidden" />
              <FolderOpenIcon className="w-4 h-4 mr-2 group-hover:flex hidden" />
              <Link href="/snippets">My Snippets</Link>
            </button>
          </div>
          <div className="text-right">
            <LoginButtons />
          </div>
        </div>
        {loggedIn ? (
          <>
            <div className="text-2xl font-bold">My Profile</div>
            <br />
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                type="text"
                value={username}
                disabled
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={email}
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 sm:w-auto"
              >
                Update Email
              </button>
            </form>
          </>
        ) : (
          <div>Please log in to view profile!</div>
        )}
      </div>
    </>
  );
}
