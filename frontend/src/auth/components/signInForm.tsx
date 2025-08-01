"use client";

import { useState } from "react";
import { signInAction } from "../actions";

export default function SignInForm() {
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await signInAction({
      identifier: formData.get("identifier")!.toString(),
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
      <label htmlFor="identifier">Identifier</label>
      <input type="text" id="identifier" name="identifier" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" />
      <button type="submit">Sign In</button>
    </form>
  );
}
