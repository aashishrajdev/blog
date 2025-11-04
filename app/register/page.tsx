"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong..!");
        setLoading(false);
        return;
      }
      router.push("/login");
    } catch {
      setError("Registration failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <h1
        style={{
          fontWeight: 800,
          fontSize: 36,
          marginBottom: 24,
          color: "#000",
          letterSpacing: 1,
          background: "linear-gradient(135deg, #0070f3, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Register
      </h1>
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 40,
          borderRadius: 16,
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          color: "#222",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: 16,
              transition: "border 0.2s",
              boxSizing: "border-box",
              color: "#222",
              background: "#fafbfc",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.border = "#0070f3 1.5px solid")
            }
            onBlur={(e) => (e.currentTarget.style.border = "#d1d5db 1px solid")}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: 16,
              transition: "border 0.2s",
              boxSizing: "border-box",
              color: "#222",
              background: "#fafbfc",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.border = "#0070f3 1.5px solid")
            }
            onBlur={(e) => (e.currentTarget.style.border = "#d1d5db 1px solid")}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: 16,
              transition: "border 0.2s",
              boxSizing: "border-box",
              color: "#222",
              background: "#fafbfc",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.border = "#0070f3 1.5px solid")
            }
            onBlur={(e) => (e.currentTarget.style.border = "#d1d5db 1px solid")}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              borderRadius: 6,
              background: loading ? "#b2cdfa" : "#0070f3",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && (
            <div
              style={{ color: "#b00020", textAlign: "center", fontSize: 15 }}
            >
              {error}
            </div>
          )}
        </form>
        <div style={{ textAlign: "center", fontSize: 15, marginTop: 8 }}>
          <span>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              Login
            </Link>
          </span>
          <br />
          <span>
            Go back to{" "}
            <Link
              href="/"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              Home
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Page;
