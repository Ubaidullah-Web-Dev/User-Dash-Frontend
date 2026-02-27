import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <h1 className="text-6xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
        User Dashboard System
      </h1>
      <div className="flex gap-8">
        <Link
          href="/login"
          className="group relative px-10 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-10 py-4 bg-transparent border-2 border-gray-700 hover:border-gray-500 hover:bg-gray-800 rounded-2xl font-bold transition-all active:scale-95"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
