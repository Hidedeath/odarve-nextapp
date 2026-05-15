"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type LoginResponse = {
  message?: string;
};

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegistrationSuccess(params.get("registered") === "1");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message ?? "Login failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setIsError(true);
      setMessage("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card reveal">
        <p className="eyebrow">Secure Access</p>
        <h1>Login to your dashboard</h1>
        <p className="auth-copy">
          Sign in with your account from your XAMPP MySQL database.
        </p>

        {registrationSuccess ? (
          <p className="form-message success">
            Registration complete. You can now log in.
          </p>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            required
          />

          {message ? (
            <p className={isError ? "form-message error" : "form-message success"}>
              {message}
            </p>
          ) : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="switch-link">
          Need an account? <Link href="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}
