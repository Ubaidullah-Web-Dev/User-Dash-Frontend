import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <h1 className="text-6xl font-black mb-8 bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-gradient tracking-tighter">
        User Dashboard System
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Link
          href="/login"
          className="group relative px-10 py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-10 py-4 bg-secondary/50 border border-border hover:bg-secondary text-foreground rounded-2xl font-bold transition-all active:scale-95"
        >
          Create Account
        </Link>
        <Link
          href="/marketplace"
          className="px-10 py-4 bg-linear-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/25"
        >
          Explore Marketplace
        </Link>
      </div>
    </div>
  );
}
