"use client";

import LoginButtons from "../shared/loginButtons";
import Link from "next/link";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { FormEvent } from "react";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [snippets, setSnippets] = useState<[Snippet] | []>([]);
  const [snipsDefined, setSnipsDefined] = useState(false);
  let username = "";
  if (typeof window !== "undefined") {
    username = localStorage.getItem("username") || "";
  }

  type Snippet = {
    artist: string;
    song: string;
    content: string;
    _id: {
      $oid: string;
    };
  };

  useEffect(() => {
    if (username && username != "") {
      try {
        fetch(`http://127.0.0.1:5000/is_logged_in/${username}`)
          .then((response) => response.text())
          .then((data) => {
            if (data === "True") {
              setLoggedIn(true);
              getSnips(false);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [username, snippets]);

  async function getSnips(forceCheck: boolean) {
    if (forceCheck === undefined) {
      forceCheck = false;
    }
    console.log(forceCheck);
    if (!snipsDefined || forceCheck) {
      // prevent multiple runs
      console.log("hi");
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get-snips/${username}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const res = await response.json();

          console.log(res);
          setSnippets(res);
          setSnipsDefined(true);

          if (res !== "False") {
            console.log("Saved snippet");
          } else {
            console.log("Error saving");
          }
        } else {
          // Handle errors
        }
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  }

  async function deleteSnip(content: string) {
    console.log(content);
    // prevent multiple runs
    try {
      const response = await fetch("http://127.0.0.1:5000/delete-snip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }); //weird thing with the url ""

      if (response.ok) {
        const res = await response.text();

        console.log(res);
        setSnipsDefined(false);
        getSnips(true);

        if (res !== "False") {
        } else {
        }
      } else {
        // Handle errors
      }
    } catch (error) {
      console.log(error);
    }
  }

  function toggleModal(open: boolean) {
    const modal = document.getElementById("add-snip-modal") as HTMLInputElement;

    if (open) {
      modal.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const artist = formData.get("artist");
    const song = formData.get("song");
    const content = (document.getElementById("content") as HTMLInputElement)
      .value;

    try {
      const response = await fetch("http://127.0.0.1:5000/save-snip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snip: content, artist, song, username }),
      });

      if (response.ok) {
        const res = await response.text();

        if (res === "True") {
          console.log("Saved snippet");
          alert("Saved!");
          toggleModal(false);
          setSnipsDefined(false);
          getSnips(true);
        } else {
          console.log("Error saving");
          alert("There was an error, please try again");
        }
      } else {
        // Handle errors
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="m-4">
        <div className="mb-4 flex items-center justify-between">
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow">
            <Link href="/search">Go to Search</Link>
          </button>
          <div className="text-right">
            <LoginButtons />
          </div>
        </div>
        {loggedIn ? (
          <>
            <div className="text-2xl font-bold">My Snippets</div>
            <br />

            <div className="flex flex-wrap gap-2 h-full">
              {snippets.map((snippet) => (
                <div
                  className="group w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 border-2 border-indigo-200 hover:bg-gray-100 hover:border-indigo-300 p-3 pr-3 rounded-lg shadow text-gray-700 flex justify-between"
                  key={snippet["_id"]["$oid"]}
                >
                  <div>
                    <div className="text-base mb-2 leading-5">
                      {snippet.content
                        .trim()
                        .split("\n")
                        .map((line: string, i: number) => {
                          return line == "" ? (
                            <br key={i} />
                          ) : (
                            <div key={line + i}>
                              <span>{line}</span>
                              <br />
                            </div>
                          );
                        })}
                    </div>
                    <div className="text-sm text-gray-500 font-bold">
                      {snippet.artist}
                    </div>
                    <div className="text-sm text-gray-400">{snippet.song}</div>
                  </div>
                  <div id="delete">
                    <TrashIcon
                      className="w-8 h-4 ml-2 cursor-pointer"
                      onClick={() => deleteSnip(snippet.content)}
                    />
                  </div>
                </div>
              ))}

              <div
                className="group w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-4hover:bg-gray-100 p-3 pr-3 rounded-lg shadow text-gray-700 flex  bg-indigo-500 hover:bg-indigo-400 text-center items-center justify-center min-h-28 cursor-pointer"
                onClick={() => toggleModal(true)}
              >
                <PlusIcon className="w-8 h-8 text-white " />
              </div>
            </div>

            <div
              className="relative z-10 hidden"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
              id="add-snip-modal"
            >
              <div
                className="fixed inset-0 bg-gray-500/75 transition-opacity"
                aria-hidden="true"
              ></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                  <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">
                      Manually add a snippet
                    </h1>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Artist
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="artist"
                          type="text"
                          name="artist"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Song
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="song"
                          type="text"
                          name="song"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Content
                        </label>
                        <textarea
                          className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
                          id="content"
                          name="content"
                          placeholder="Your snippet here"
                          required
                        />
                      </div>

                      <p
                        className="text-red-500 text-xs italic mt-4 hidden"
                        id="err"
                      ></p>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 sm:ml-3 sm:w-auto"
                        >
                          Submit
                        </button>
                        <button
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => toggleModal(false)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>Please log in to see snippets!</div>
        )}
      </div>
    </>
  );
}
