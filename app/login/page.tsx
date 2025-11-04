"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setError(`Google login failed: ${result.error}`);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
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
        Login
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
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 6,
            background: "#fff",
            color: "#222",
            border: "1.5px solid #4285F4",
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            style={{ display: "inline", verticalAlign: "middle" }}
          >
            <g>
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.69 30.18 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.19C12.13 13.99 17.57 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.67 28.28c-1.01-2.99-1.01-6.19 0-9.18l-7.98-6.19C.64 16.09 0 19.01 0 22c0 2.99.64 5.91 1.77 8.63l7.98-6.19z"
              />
              <path
                fill="#EA4335"
                d="M24 44c6.18 0 11.36-2.05 15.14-5.59l-7.19-5.59c-2.01 1.35-4.58 2.16-7.95 2.16-6.43 0-11.87-4.49-13.33-10.48l-7.98 6.19C6.71 42.18 14.82 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </g>
          </svg>
          <span>Sign in with Google</span>
        </button>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 6,
            background: "#24292e",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 16 16"
            style={{ display: "inline", verticalAlign: "middle" }}
          >
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
          <span>Sign in with GitHub</span>
        </button>
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
            {loading ? "Logging in..." : "Login"}
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
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              Register
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

export default Login;
