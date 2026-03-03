'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import {
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Trash2,
    Eye,
    Plus,
    CheckCircle,
    EyeOff,
    Search,
    Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    stock: number;
    isRecommended: boolean;
    isActive: boolean;
    category: { name: string };
    seller: { email: string };
    createdAt: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err: unknown) {
                console.error("Failed to load categories", err);
            }
        };
        fetchCategories();
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (category !== 'all') params.category = category;

            const response = await api.get('/admin/products', { params });
            setProducts(response.data);
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [search, category]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        try {
            await api.delete(`/admin/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            toast.success("Product deleted successfully");
        } catch (err: unknown) {
            console.error(err);
            toast.error("Deletion failed");
        }
    };

    const handleToggleActive = async (id: number) => {
        try {
            const response = await api.patch(`/admin/products/${id}/toggle-active`);
            setProducts(products.map(p => p.id === id ? { ...p, isActive: response.data.isActive } : p));
            toast.success(response.data.isActive ? "Listing is now live" : "Listing hidden");
        } catch (err: unknown) {
            console.error(err);
            toast.error("Status update failed");
        }
    };

    if (loading) return <div className="text-primary font-black animate-pulse text-center py-20">SYNCHRONIZING CATALOG...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter mb-2">PRODUCT <span className="text-primary">MANAGEMENT</span></h1>
                    <p className="text-muted-foreground font-medium text-sm sm:text-base">Monitor and moderate all marketplace listings.</p>
                </div>
                <Link href="/marketplace/post-ad" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-primary hover:opacity-90 text-primary-foreground font-black px-8 rounded-xl h-14 shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <Plus className="mr-2 h-5 w-5" /> CREATE PRODUCT
                    </Button>
                </Link>
            </div>

            <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-10 border-b border-border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <CardTitle className="text-xl font-bold flex items-center shrink-0 text-foreground">
                            <Package className="mr-3 h-6 w-6 text-primary" />
                            All Listings ({products.length})
                        </CardTitle>

                        <div className="flex flex-1 flex-col md:flex-row gap-4 max-w-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search in catalog..."
                                    className="pl-12 bg-secondary/50 border-border focus:ring-primary/20"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-56">
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="bg-secondary/50 border-border h-11 rounded-xl">
                                        <div className="flex items-center">
                                            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Category" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground rounded-xl">
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border bg-secondary/30">
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Product</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Category</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Price</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-center hidden md:table-cell">Featured</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-center hidden sm:table-cell">Visibility</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-secondary/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded-xl bg-secondary border border-border mr-4 hidden sm:flex items-center justify-center font-black text-primary text-xs shrink-0">
                                                    {product.name[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{product.name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">Stock: {product.stock}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 hidden lg:table-cell">
                                            <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-black">{product.category.name}</Badge>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-black text-foreground text-sm">${parseFloat(product.price).toLocaleString()}</span>
                                        </td>
                                        <td className="p-6 text-center hidden md:table-cell">
                                            {product.isRecommended ? (
                                                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-black">YES</Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground font-bold">—</span>
                                            )}
                                        </td>
                                        <td className="p-6 text-center hidden sm:table-cell">
                                            <button
                                                onClick={() => handleToggleActive(product.id)}
                                                className={`transition-all ${product.isActive ? 'text-emerald-500' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                {product.isActive ? <CheckCircle className="h-5 w-5 mx-auto" /> : <EyeOff className="h-5 w-5 mx-auto" />}
                                            </button>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-1 sm:gap-2">
                                                <Link href={`/marketplace/${product.slug}`}>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl shrink-0">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-muted-foreground hover:text-red-500 rounded-xl shrink-0"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
