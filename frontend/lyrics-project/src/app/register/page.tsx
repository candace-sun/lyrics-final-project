"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL } from "../shared/backendURL";

export default function RegisterPage() {
  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const username = formData.get("username");
    const password1 = formData.get("password1");
    const password2 = formData.get("password2"); // need to validate
    let err = "";

    if (password1 !== password2) {
      err = "Your passwords do not match";
    } else {
      if (
        !password1 ||
        password1.toString().length < 6 ||
        password1.toString().length > 30
      ) {
        err = "Your password must be between 6-30 characters";
      }
    }

    if (
      !username ||
      username.toString().length < 6 ||
      username.toString().length > 20
    ) {
      err = "Your username must be between 6-20 characters";
    }

    console.log(email, password1, username);

    // send request if input is validated
    if (err == "") {
      try {
        const response = await fetch(`${BACKEND_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password: password1 }),
        });

        if (response.ok) {
          const res = await response.text();

          if (res === "False") {
            err = "Your username or email is already in use";
          } else {
            router.push("/login");
          }
        } else {
          // Handle errors
          const myContainer = document.getElementById(
            "err"
          ) as HTMLInputElement;
          myContainer.innerHTML = "Please try again";
          myContainer.style.display = "block";
        }
      } catch (error) {
        err = "Server error";
        console.log(error);
      }
    }

    if (err !== "") {
      const myContainer = document.getElementById("err") as HTMLInputElement;
      myContainer.innerHTML = err;
      myContainer.style.display = "block";
    }
  }

  return (
    <>
      <div className="w-full max-w-xs m-4">
        <h1 className="text-2xl font-bold">Register</h1>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password1"
              type="password"
              name="password1"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
              id="password2"
              type="password"
              name="password2"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="flex items-center justify-start gap-4">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>

            <Link href="/login">Login</Link>
          </div>

          <p className="text-red-500 text-xs italic mt-4 hidden" id="err"></p>
        </form>
      </div>
    </>
  );
}
