"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    ArrowUpRight,
    ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

interface VendorOrder {
    id: number;
    vendorName: string;
    productName: string;
    quantity: number;
    status: 'pending' | 'approved' | 'received' | 'cancelled';
    createdAt: string;
    receivedAt: string | null;
}

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');

    const fetchOrders = async () => {
        try {
            const url = filter ? `/admin/vendor-orders?status=${filter}` : '/admin/vendor-orders';
            const response = await api.get(url);
            setOrders(response.data);
        } catch (err) {
            toast.error("Failed to load supply orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/admin/vendor-orders/${id}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4" />;
            case 'approved': return <Truck className="h-4 w-4" />;
            case 'received': return <CheckCircle2 className="h-4 w-4" />;
            case 'cancelled': return <XCircle className="h-4 w-4" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'approved': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'received': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-secondary text-muted-foreground';
        }
    };

    if (loading && orders.length === 0) return <div className="py-20 text-center font-black animate-pulse text-primary tracking-widest uppercase text-foreground">Fetching Global Supply Chain...</div>;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2 italic uppercase">SUPPLY <span className="text-primary not-italic">Orders</span></h1>
                    <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest leading-loose">Track and manage inventory restock requests from all vendors.</p>
                </div>

                <div className="flex items-center gap-3">
                    {['', 'pending', 'approved', 'received', 'cancelled'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === s ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-card text-muted-foreground border-border hover:border-primary/50'}`}
                        >
                            {s || 'ALL'}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="bg-card border-border rounded-[3rem] shadow-2xl overflow-hidden border-t-4 border-t-primary/20">
                <CardHeader className="p-10 border-b border-border bg-secondary/30">
                    <CardTitle className="text-xl font-black tracking-tight flex items-center italic text-foreground uppercase">
                        <ShoppingBag className="mr-4 h-6 w-6 text-primary" />
                        GLOBAL REQUEST LIST ({orders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border bg-background/50">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">ID & Date</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Supplier / Product</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Qty</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Update Flow</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-muted-foreground font-black uppercase tracking-widest opacity-50 italic">
                                            No orders found matching the criteria
                                        </td>
                                    </tr>
                                ) : orders.map((o) => (
                                    <tr key={o.id} className="hover:bg-secondary/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-foreground group-hover:text-primary transition-colors tracking-tighter">#SUP-{o.id}</span>
                                                <span className="text-[10px] text-muted-foreground font-bold">{new Date(o.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground flex items-center">
                                                    {o.vendorName}
                                                    <ArrowUpRight className="ml-1.5 h-3 w-3 text-muted-foreground group-hover:text-primary" />
                                                </span>
                                                <span className="text-xs text-muted-foreground uppercase font-black tracking-widest flex items-center">
                                                    <Package className="mr-1.5 h-3 w-3" /> {o.productName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="font-black text-foreground text-lg tracking-tighter">{o.quantity.toLocaleString()}</span>
                                            <span className="text-[10px] text-muted-foreground ml-1.5 font-bold uppercase">Units</span>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest space-x-2 ${getStatusColor(o.status)}`}>
                                                {getStatusIcon(o.status)}
                                                <span>{o.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2 text-foreground">
                                                {o.status === 'pending' && (
                                                    <Button
                                                        onClick={() => handleStatusUpdate(o.id, 'approved')}
                                                        className="h-10 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-primary/20 rounded-xl font-black text-[10px] tracking-widest"
                                                    >
                                                        APPROVE
                                                    </Button>
                                                )}
                                                {o.status === 'approved' && (
                                                    <Button
                                                        onClick={() => handleStatusUpdate(o.id, 'received')}
                                                        className="h-10 px-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border-emerald-500/20 rounded-xl font-black text-[10px] tracking-widest"
                                                    >
                                                        MARK RECEIVED
                                                    </Button>
                                                )}
                                                {o.status !== 'received' && o.status !== 'cancelled' && (
                                                    <Button
                                                        onClick={() => handleStatusUpdate(o.id, 'cancelled')}
                                                        variant="ghost"
                                                        className="h-10 px-4 text-red-500 hover:bg-red-500/10 rounded-xl font-black text-[10px] tracking-widest"
                                                    >
                                                        CANCEL
                                                    </Button>
                                                )}
                                                {o.status === 'received' && (
                                                    <span className="text-[10px] font-black text-emerald-500 italic uppercase bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-sm">STOCK UPDATED ✓</span>
                                                )}
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
