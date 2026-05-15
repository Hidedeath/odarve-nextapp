"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type RegisterResponse = {
  message?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message ?? "Registration failed.");
        return;
      }

      router.push("/?registered=1");
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
        <p className="eyebrow">Create Account</p>
        <h1>Start your dashboard access</h1>
        <p className="auth-copy">
          Register a new account. Your password is hashed before it is saved.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Jane"
            autoComplete="given-name"
            required
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Doe"
            autoComplete="family-name"
            required
          />

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
          <div className="password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button
              className="eye-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path
                    d="M10.4 10.4A3 3 0 0 0 13.6 13.6M9.9 5.1A10.8 10.8 0 0 1 12 4.9c5.5 0 9.7 4.4 10.8 7.1a11.4 11.4 0 0 1-3.9 4.9M6.7 6.7A12.4 12.4 0 0 0 1.2 12a12.2 12.2 0 0 0 6.5 6.3"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M1.2 12s4.2-7.1 10.8-7.1S22.8 12 22.8 12s-4.2 7.1-10.8 7.1S1.2 12 1.2 12z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>

          {message ? (
            <p className={isError ? "form-message error" : "form-message success"}>
              {message}
            </p>
          ) : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="switch-link">
          Already registered? <Link href="/">Log in</Link>
        </p>
      </section>
    </main>
  );
}
