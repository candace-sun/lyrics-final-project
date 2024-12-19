// export default async function Page() {
//   const data = await fetch("http://127.0.0.1:5000/login");
//   const res = await data.text();

//   return <ul>{res}</ul>;
// }

"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL } from "../shared/backendURL";

export default function LoginPage() {
  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const myContainer = document.getElementById("err") as HTMLInputElement;

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const res = await response.text();
        console.log("success!" + res);
        if (res === "True") {
          router.push("/search");
          if (username) {
            localStorage.setItem("username", username.toString());
          }
        } else {
          myContainer.innerHTML = "Please try again";
          myContainer.style.display = "block";
        }
      } else {
        // Handle errors
        myContainer.innerHTML = "Please try again";
        myContainer.style.display = "block";
      }
    } catch (error) {
      myContainer.innerHTML = "Server error";
      console.log(error);
      myContainer.style.display = "block";
    }
  }

  return (
    <>
      <div className="w-full max-w-xs m-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              required
            />
          </div>
          <div className="flex items-center justify-start gap-4">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <Link href="/register">Sign Up</Link>
          </div>
          <p className="text-red-500 text-xs italic mt-4 hidden" id="err"></p>
        </form>
      </div>
    </>
  );
}
