'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
    id: number;
    email: string;
    roles: string[];
    name: string;
}

export default function AdminSettingsPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

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

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            setUpdating(userId);
            // We simplify to single role choice for the UI, though backend supports array
            const response = await api.patch(`/admin/users/${userId}/role`, { roles: [newRole] });
            setUsers(users.map(u => u.id === userId ? { ...u, roles: response.data.roles } : u));
            toast.success("User role updated successfully");
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to update role");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <div className="text-primary font-black animate-pulse text-center py-20 uppercase tracking-widest">INITIALIZING SECURITY PROTOCOLS...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">SYSTEM <span className="text-primary">SETTINGS</span></h1>
                <p className="text-muted-foreground font-medium">Configure global parameters and manage administrator privileges.</p>
            </div>

            <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="p-10 border-b border-border">
                    <CardTitle className="text-xl font-bold flex items-center text-foreground">
                        <Shield className="mr-3 h-6 w-6 text-primary" />
                        Role Management
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-medium mt-2">
                        Elevate users to administrators or revoke access levels.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border bg-secondary/30">
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">User</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Current Rank</th>
                                    <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Assign New Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-secondary/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-muted-foreground mr-4">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{u.name || 'ANONYMOUS'}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex gap-2">
                                                {u.roles.map(role => (
                                                    <Badge key={role} variant="outline" className={`text-[9px] font-black border-none px-2 py-0.5 ${role.includes('ADMIN') ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                                                        {role.replace('ROLE_', '')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end items-center gap-4">
                                                {updating === u.id && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                                                <Select
                                                    disabled={updating === u.id}
                                                    onValueChange={(val) => handleRoleUpdate(u.id, val)}
                                                    defaultValue={u.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : u.roles.includes('ROLE_MODERATOR') ? 'ROLE_MODERATOR' : 'ROLE_USER'}
                                                >
                                                    <SelectTrigger className="w-40 bg-secondary border-border rounded-xl h-10 text-xs font-black focus:ring-primary/20 text-foreground">
                                                        <SelectValue placeholder="Select Role" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-card border-border text-foreground rounded-xl">
                                                        <SelectItem value="ROLE_USER">USER</SelectItem>
                                                        <SelectItem value="ROLE_MODERATOR">MODERATOR</SelectItem>
                                                        <SelectItem value="ROLE_ADMIN">ADMINISTRATOR</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
