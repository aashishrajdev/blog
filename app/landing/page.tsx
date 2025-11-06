import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Blog
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Share your knowledge. Grow your audience.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Simple, beautiful blog platform with auth, categories, and a modern editor.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
              Create account
            </Link>
            <Link href="/" className="px-6 py-3 border border-gray-200 rounded-lg text-gray-700">
              Browse posts
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">Fast publishing</h3>
            <p className="text-gray-600">Write and publish posts quickly with editor tools and image uploads.</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">Engage readers</h3>
            <p className="text-gray-600">Comments, likes and social sharing to build a community around your content.</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">Easy auth</h3>
            <p className="text-gray-600">Sign in with GitHub, Google or credentials. Control your content securely.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to start your blog?</h2>
          <p className="mb-6 text-gray-100">Join the community and publish your first post in minutes.</p>
          <Link href="/register" className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold">
            Create account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blog — Built with ❤️
        </div>
      </footer>
    </main>
  );
}
