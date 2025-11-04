"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Footer from "../components/Footer";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <div>
        Access denied. Please <Link href="/login">login</Link>.
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          textAlign: "center",
          marginTop: 40,
          paddingBottom: 30,
        }}
      >
        <h1 style={{ marginBottom: 32 }}>
          <span style={{ color: "#0070f3", fontWeight: 800 }}>Blog</span>{" "}
          Profile
        </h1>
        <div
          style={{
            maxWidth: 500,
            margin: "0 auto",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderRadius: 16,
            padding: 40,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <strong style={{ color: "#666", fontSize: 14 }}>User ID:</strong>
            <p style={{ color: "#000", fontSize: 16, marginTop: 8 }}>
              {session.user?.id}
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <strong style={{ color: "#666", fontSize: 14 }}>Email:</strong>
            <p style={{ color: "#000", fontSize: 16, marginTop: 8 }}>
              {session.user?.email}
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
