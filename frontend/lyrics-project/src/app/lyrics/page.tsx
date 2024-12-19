"use client";
import { useSearchParams } from "next/navigation";
import LoginButtons from "../shared/loginButtons";
import { BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { Suspense } from "react";

import Lyrics from "@/app/lyrics/lyrics";
// import Test from "@/app/lyrics/test";
import { useState, useEffect } from "react";

function LyricsPage() {
  const [data, setData] = useState(""); //[] as string[]); // based on your data you should store it here in state
  // const [romanized, setRomanized] = useState("");
  // const [translated, setTranslated] = useState("");
  const [snip, setSnip] = useState("");
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const [params] = useState(new URLSearchParams(searchParams));

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

  useEffect(() => {
    const fetchData = async (
      artist: string | undefined,
      song: string | undefined
    ) => {
      try {
        let cleanedSong;
        if (song) {
          cleanedSong = song.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "_");
        }
        const data = await fetch(
          `http://127.0.0.1:5000/lyrics/${artist}/${cleanedSong}`
        );
        const lyrics = await data.text();
        // setData(lyrics.toString().split("\n"));
        setData(lyrics);
        if (artist && song) {
          setArtist(artist);
          setSong(song);
        }
      } catch (error) {
        console.log(error);
        const errText = document.getElementById("err") as HTMLInputElement;
        const myContainer = document.getElementById(
          "err-container"
        ) as HTMLInputElement;
        errText.innerHTML =
          "Sorry, we currently don't have the lyrics for this song :(";
        myContainer.style.display = "block";
      }
    };

    fetchData(params.get("artist")?.toString(), params.get("song")?.toString());
  }, [params]);

  if (data != "") {
    document.addEventListener("mouseup", () => {
      const s = window.getSelection();
      const getTool = document.getElementById(
        "snip-tooltip"
      ) as HTMLInputElement;
      const yScrollOffset = window.scrollY;
      if (s) {
        try {
          const oRange = s.getRangeAt(0); //get the text range
          const oRect = oRange.getBoundingClientRect();

          if (s.toString().length) {
            getTool.style.left = oRect.left + oRect.width / 2 - 40 + "px";
            getTool.style.top = oRect.top - 24 - 10 + yScrollOffset + "px";
            getTool.classList.add("active");
          } else {
            getTool.style.display = "none";
          }

          // s.toString().length
          //   ? ((getTool.style.left = oRect.left + oRect.width / 2 - 40 + "px"), // 110 is toolbox.width/2
          //     (getTool.style.top = oRect.top - 24 - 10 + yScrollOffset + "px"), //45 is toolbow.height
          //     getTool.classList.add("active"))
          //   : (getTool.style.display = "none");

          getTool.style.display = "inline-flex";

          if (s.toString().length == 0) {
            getTool.style.display = "none";
          } else {
            setSnip(s.toString());
            console.log(s.toString());
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        getTool.style.display = "none";
      }
    });
  }

  async function saveSnip() {
    if (loggedIn) {
      try {
        const response = await fetch("http://127.0.0.1:5000/save-snip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ snip: snip.trim(), artist, song, username }),
        });

        if (response.ok) {
          const res = await response.text();

          if (res === "True") {
            console.log("Saved snippet");
            alert("Saved!");
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
    } else {
      alert("Please log in to save snippets!");
    }
  }

  return (
    <div className="m-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => history.back()}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow items-center inline-flex "
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          <span>Go Back</span>
        </button>
        <LoginButtons />
      </div>
      <div className="ml-4 mt-4 mb-10">
        <Lyrics />
        {data.split("\n").map((line, i) => {
          return line == "" ? (
            <br key={i} />
          ) : (
            <div key={line + i}>
              <span className="hover:underline	hover:decoration-indigo-100 decoration-2">
                {line}
              </span>
              <br />
            </div>
          );
        })}

        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative hidden"
          role="alert"
          id="err-container"
        >
          <span className="block sm:inline" id="err"></span>
        </div>
      </div>
      {/* <pre id="lyrics">{data}</pre> */}
      <button
        id="snip-tooltip"
        className="absolute bg-indigo-500 hover:bg-indigo-700 py-1 px-3 rounded-md text-white hidden items-center shadow group"
        onClick={saveSnip}
      >
        <BookmarkIcon className="w-4 h-4 mr-2 group-hover:hidden" />
        <BookmarkSolidIcon className="w-4 h-4 mr-2 group-hover:flex hidden" />
        <span>Save snippet</span>
      </button>
    </div>
  );
}

export default function Page() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <LyricsPage />
    </Suspense>
  );
}
