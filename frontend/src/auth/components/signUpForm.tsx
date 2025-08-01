"use client";

import { useState } from "react";
import { signUpAction } from "../actions";

export default function SignUpForm() {
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await signUpAction({
      username: formData.get("username")!.toString(),
      email: formData.get("identifier")!.toString(),
      password: formData.get("password")!.toString(),
    });
    if (result.status) {
      if (result.message) {
        setMessage(result.message);
      }
    } else {
      setMessage(result.message);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      {message && <p>{message}</p>}
      <label htmlFor="username">username</label>
      <input type="text" id="username" name="username" />
      <label htmlFor="identifier">email</label>
      <input type="email" id="identifier" name="identifier" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" />
      <button type="submit">Sign up</button>
    </form>
  );
}
