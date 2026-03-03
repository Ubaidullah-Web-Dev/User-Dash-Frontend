"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, ArrowLeft, Package, Hash, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Vendor {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    };
}

interface Product {
    id: number;
    name: string;
}

export default function PlaceVendorOrderPage() {
    const params = useParams();
    const router = useRouter();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        comment: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vendorRes = await api.get(`/admin/vendors/${params.id}`);
                setVendor(vendorRes.data);

                // Fix: Ensure we use the right endpoint for products by category
                const productsRes = await api.get(`/products?category=${vendorRes.data.category.id}`);
                setProducts(productsRes.data);
            } catch (err) {
                toast.error("Failed to load supply chain data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId || !formData.quantity) {
            toast.error("Please fill in all required fields");
            return;
        }

        const qty = parseInt(formData.quantity);
        if (isNaN(qty) || qty <= 0) {
            toast.error("Quantity must be a positive integer");
            return;
        }

        if (qty > 10000) {
            toast.error("Max limit is 10,000 units per order");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/admin/vendor-orders', {
                vendorId: parseInt(params.id as string),
                productId: parseInt(formData.productId),
                quantity: qty,
                comment: formData.comment
            });
            toast.success("Supply order placed successfully!");
            router.push('/admin/vendor-orders');
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to place order");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center font-black animate-pulse text-primary tracking-widest uppercase text-foreground">Syncing Vendor Inventory...</div>;
    if (!vendor) return <div className="py-20 text-center font-black text-muted-foreground uppercase tracking-widest">Supplier Not Found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link href="/admin/vendors" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-bold group uppercase text-[10px] tracking-widest">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Vendors
            </Link>

            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2 italic uppercase">NEW SUPPLY <span className="text-primary tracking-tight not-italic">Order</span></h1>
                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest leading-loose">Restocking request for <span className="text-foreground font-black">{vendor.name}</span> in the <span className="text-primary font-black">{vendor.category.name}</span> category.</p>
            </div>

            <Card className="bg-card border-border rounded-[3rem] shadow-2xl overflow-hidden border-t-4 border-t-primary/20">
                <CardHeader className="p-10 border-b border-border bg-secondary/30">
                    <CardTitle className="flex items-center text-xl font-black italic tracking-tight text-foreground">
                        <ShoppingCart className="mr-4 h-6 w-6 text-primary" />
                        ORDER CONFIGURATION
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center">
                                    <Package className="mr-2 h-3.5 w-3.5" /> Target Product
                                </Label>
                                <select
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    className="w-full h-14 px-4 bg-secondary/50 border border-border rounded-2xl font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                    required
                                >
                                    <option value="">Select a product...</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center">
                                    <Hash className="mr-2 h-3.5 w-3.5" /> Order Quantity
                                </Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="10000"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="h-14 bg-secondary/50 font-bold rounded-2xl text-foreground"
                                    placeholder="Enter units (e.g. 50)"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center">
                                <MessageSquare className="mr-2 h-3.5 w-3.5" /> Internal Comments
                            </Label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                className="w-full min-h-[120px] p-6 bg-secondary/50 border border-border rounded-3xl font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Additional instructions or notes for the vendor..."
                                maxLength={1000}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-16 bg-primary text-primary-foreground hover:opacity-90 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {submitting ? "PROCESSING..." : (
                                <>SUBMIT SUPPLY ORDER <Send className="ml-3 h-5 w-5" /></>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
