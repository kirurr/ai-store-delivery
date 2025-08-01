"use server";

import { ServerActionResponse } from "@/types";
import { cookies } from "next/headers";
import {
  StrapiSignInRequest,
  StrapiSignUpRequest,
  StrapiAuthResponse,
} from "@shared";

export async function signUpAction({
  username,
  email,
  password,
}: StrapiSignUpRequest): Promise<ServerActionResponse> {
  try {
    const response = await fetch("http://gateway:4000/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as StrapiAuthResponse;
    if (!response.ok) {
      if ("error" in data) {
        return { status: false, message: data.error.message };
      }
      const message = `HTTP error! Status: ${response.status}`;
      return { status: false, message };
    }

    if ("error" in data) {
      return { status: false, message: data.error.message };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.jwt);

    return { status: true, message: "Signed up successfully" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { status: false, message: message };
  }
}
export async function signInAction({
  identifier,
  password,
}: StrapiSignInRequest): Promise<ServerActionResponse> {
  try {
    const response = await fetch("http://gateway:4000/auth/signin", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = (await response.json()) as StrapiAuthResponse;
    if (!response.ok) {
      if ("error" in data) {
        return { status: false, message: data.error.message };
      }
      const message = `HTTP error! Status: ${response.status}`;
      return { status: false, message };
    }

    if ("error" in data) {
      return { status: false, message: data.error.message };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.jwt);

    return { status: true, message: "Signed in successfully" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return { status: false, message: message };
  }
}
