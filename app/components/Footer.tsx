import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: "20px 20px",
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#000",
            marginBottom: 16,
          }}
        >
          Share your thoughts
        </h3>
        <p style={{ color: "#999", fontSize: 12, margin: "0 0 8px 0" }}>
          © {new Date().getFullYear()} Blog. All rights reserved.
        </p>
        <p style={{ color: "#555", fontSize: 13, margin: 0, fontWeight: 500 }}>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/aashishrajdev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0070f3",
              textDecoration: "none",
              fontWeight: 600,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Aashish
          </a>
        </p>
      </div>
    </footer>
  );
}
