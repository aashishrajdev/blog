export default function Footer() {
  return (
    <footer className="mt-10 p-5 bg-white/50 backdrop-blur-md border-t border-black/10 text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-extrabold text-black mb-4">
          Share your thoughts
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          © {new Date().getFullYear()} Blog. All rights reserved.
        </p>
        <p className="text-sm text-gray-600 m-0 font-medium">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/aashishrajdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold no-underline hover:opacity-80"
          >
            Aashish
          </a>
        </p>
      </div>
    </footer>
  );
}
