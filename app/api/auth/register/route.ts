import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    };

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "First name, last name, email, and password are required." },
        { status: 400 },
      );
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        { message: "First and last name must be at least 2 characters." },
        { status: 400 },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const name = `${firstName} ${lastName}`;
    const passwordHash = await bcrypt.hash(password, 12);
    await createUser({ name, email, passwordHash });

    return NextResponse.json(
      { message: "Account created successfully. Please log in." },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Unable to register right now. Please try again." },
      { status: 500 },
    );
  }
}
