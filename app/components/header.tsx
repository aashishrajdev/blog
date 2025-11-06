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
    <header className="w-full bg-white/70 backdrop-blur-[20px] sticky top-0 z-50 shadow-sm border-b border-black/10">
      <nav className="max-w-[1200px] mx-auto px-6 flex justify-between items-center py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
        >
          Blog
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Theme toggle */}
          <button
            onClick={() => {
              try {
                const current =
                  document.documentElement.getAttribute("data-theme") === "dark"
                    ? "dark"
                    : "light";
                const next = current === "dark" ? "light" : "dark";
                // update local storage via context if available
                // fallback: set attribute directly
                document.documentElement.setAttribute("data-theme", next);
                window.localStorage.setItem("theme", next);
              } catch {}
            }}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:opacity-90"
            aria-label="Toggle theme"
          >
            <span className="sr-only">Toggle theme</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-moon"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <Link
            href="/"
            className="text-base text-gray-800 font-medium hover:opacity-80"
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
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-blue-50 text-blue-600 border border-blue-200 hover:scale-105 transition-transform"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-blue-50 text-blue-600 border border-blue-200 hover:scale-105 transition-transform"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="flex md:hidden bg-transparent border-none p-2 flex-col gap-1"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-[3px] bg-gray-800 rounded-sm transition-transform ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-[3px] bg-gray-800 rounded-sm transition-opacity ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-6 h-[3px] bg-gray-800 rounded-sm transition-transform ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`${
          isMenuOpen ? "max-h-[500px]" : "max-h-0"
        } overflow-hidden transition-[max-height] duration-300 bg-white/95 backdrop-blur-[20px] md:hidden ${
          isMenuOpen ? "border-b border-black/10" : ""
        }`}
      >
        <div className="flex flex-col p-4 gap-4">
          {/* Mobile theme toggle (visible on phones) */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                try {
                  const current =
                    document.documentElement.getAttribute("data-theme") ===
                    "dark"
                      ? "dark"
                      : "light";
                  const next = current === "dark" ? "light" : "dark";
                  document.documentElement.setAttribute("data-theme", next);
                  window.localStorage.setItem("theme", next);
                } catch {}
              }}
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:opacity-90"
              aria-label="Toggle theme"
            >
              <span className="sr-only">Toggle theme</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-moon"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-base text-gray-800 font-medium py-2"
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
                className="py-2 px-3 rounded-lg font-semibold text-sm bg-blue-50 text-blue-600 border border-blue-200 text-center"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 px-3 rounded-lg font-semibold text-sm bg-blue-50 text-blue-600 border border-blue-200 block text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
