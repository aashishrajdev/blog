"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      style={{
        width: "100%",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        padding: "16px 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            color: "#000",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 2,
            textDecoration: "none",
            background: "linear-gradient(135deg, #0070f3, #00c6ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Blog
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
          className="desktop-nav"
        >
          <Link
            href="/"
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 16,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Home
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  color: "#333",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: 16,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                style={{
                  color: "#333",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: 16,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                style={{
                  background: "rgba(0, 112, 243, 0.1)",
                  color: "#0070f3",
                  border: "1px solid rgba(0, 112, 243, 0.2)",
                  padding: "8px 20px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 112, 243, 0.15)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 112, 243, 0.1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              style={{
                background: "rgba(0, 112, 243, 0.1)",
                color: "#0070f3",
                padding: "8px 20px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-block",
                border: "1px solid rgba(0, 112, 243, 0.2)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 112, 243, 0.15)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 112, 243, 0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={toggleMenu}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            flexDirection: "column",
            gap: 5,
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <span
            style={{
              width: 25,
              height: 3,
              background: "#333",
              borderRadius: 2,
              transition: "all 0.3s",
              transform: isMenuOpen ? "rotate(45deg) translateY(8px)" : "none",
            }}
          />
          <span
            style={{
              width: 25,
              height: 3,
              background: "#333",
              borderRadius: 2,
              transition: "all 0.3s",
              opacity: isMenuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              width: 25,
              height: 3,
              background: "#333",
              borderRadius: 2,
              transition: "all 0.3s",
              transform: isMenuOpen
                ? "rotate(-45deg) translateY(-8px)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        style={{
          maxHeight: isMenuOpen ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: isMenuOpen ? "1px solid rgba(0, 0, 0, 0.1)" : "none",
        }}
        className="mobile-menu"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "16px 24px",
            gap: 16,
          }}
        >
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 16,
              padding: "8px 0",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Home
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: "#333",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: 16,
                  padding: "8px 0",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: "#333",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: 16,
                  padding: "8px 0",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                style={{
                  background: "rgba(0, 112, 243, 0.1)",
                  color: "#0070f3",
                  border: "1px solid rgba(0, 112, 243, 0.2)",
                  padding: "10px 20px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 112, 243, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 112, 243, 0.1)";
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              style={{
                background: "rgba(0, 112, 243, 0.1)",
                color: "#0070f3",
                padding: "10px 20px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                textAlign: "center",
                display: "block",
                border: "1px solid rgba(0, 112, 243, 0.2)",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 112, 243, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 112, 243, 0.1)";
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
