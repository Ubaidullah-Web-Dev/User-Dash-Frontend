'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    PlusCircle,
    ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!user?.roles?.includes('ROLE_ADMIN') && !user?.roles?.includes('ROLE_SUPER_ADMIN')) {
                router.push('/marketplace');
            }
        }
    }, [loading, isAuthenticated, user, router]);

    if (loading || !isAuthenticated) {
        return <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 text-cyan-500 font-black">AUTHENTICATING...</div>;
    }

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Products', icon: Package, href: '/admin/products' },
        { label: 'Users', icon: Users, href: '/admin/users' },
        { label: 'Vendors', icon: Users, href: '/admin/vendors' },
        { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
        { label: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-secondary/50 dark:bg-gray-900/80 border-r border-border backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-10 px-2">
                        <Link href="/marketplace" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="font-bold text-primary-foreground text-sm">E</span>
                            </div>
                            <span className="text-lg font-black tracking-tighter text-foreground">ELECTRO <span className="text-primary">ADMIN</span></span>
                        </Link>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all group ${pathname === item.href ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${pathname === item.href ? 'text-primary' : 'group-hover:text-primary'}`} />
                                <span className="font-bold text-sm">{item.label}</span>
                                {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-border space-y-4">
                        <div className="flex items-center px-4 py-1">
                            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-primary mr-3">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-foreground truncate">{user?.email}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Admin</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-xl"
                            onClick={logout}
                        >
                            <LogOut className="mr-3 h-5 w-5" /> Sign Out
                        </Button>
                    </div>
                </div>
            </aside>
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : ''}`}>
                <header className="h-20 border-b border-border bg-background/60 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
                    <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden p-2 text-muted-foreground hover:text-foreground ${isSidebarOpen ? 'hidden' : ''}`}>
                        <Menu className="h-6 w-6" />
                    </button>
                    {/* <div className="relative w-96 hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Global Search..."
                            className="w-full bg-secondary/50 border border-border rounded-xl pl-12 pr-4 h-11 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-foreground"
                        />
                    </div> */}
                    <p className="text-2xl font-bold text-primary">Dashboard</p>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Link href="/marketplace/post-ad">
                            <Button className="bg-primary hover:opacity-90 text-primary-foreground font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20">
                                <PlusCircle className="mr-2 h-4 w-4" /> New Product
                            </Button>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
