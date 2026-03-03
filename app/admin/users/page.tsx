"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, User, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
    id: number;
    email: string;
    roles: string[];
    name: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
            } catch (err: unknown) {
                console.error(err);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="text-primary font-black animate-pulse text-center py-20 uppercase tracking-widest">Fetching user database...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">USER <span className="text-primary">DIRECTORY</span></h1>
                <p className="text-muted-foreground font-medium">Manage user accounts and global permissions.</p>
            </div>

            <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-10 border-b border-border">
                    <CardTitle className="text-xl font-bold flex items-center text-foreground">
                        <Users className="mr-3 h-6 w-6 text-primary" />
                        Registered Accounts ({users.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border bg-secondary/30">
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Identity</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Email Address</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Permissions</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right hidden lg:table-cell">Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-secondary/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-secondary border border-border hidden xs:flex items-center justify-center font-bold text-muted-foreground mr-4 shrink-0">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight block truncate">
                                                        {u.name || 'ANONYMOUS'}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground sm:hidden truncate block">{u.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 hidden sm:table-cell">
                                            <div className="flex items-center text-xs text-muted-foreground font-medium truncate">
                                                <Mail className="h-3 w-3 mr-2 shrink-0" />
                                                <span className="truncate">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center flex-wrap gap-1">
                                                {u.roles.map(role => (
                                                    <Badge key={role} variant="outline" className={`text-[9px] font-black border-none px-2 py-0.5 ${role.includes('ADMIN') ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                                                        {role.replace('ROLE_', '')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right hidden lg:table-cell">
                                            {u.roles.includes('ROLE_ADMIN') ? (
                                                <ShieldCheck className="h-4 w-4 text-primary ml-auto" />
                                            ) : (
                                                <Shield className="h-4 w-4 text-muted-foreground ml-auto" />
                                            )}
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
