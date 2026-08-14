'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data as any[]);
    } catch (err: any) {
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-[var(--muted-foreground)]">Loading users...</div>;
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-[var(--destructive)]/20 text-[var(--destructive)]',
    JOURNALIST: 'bg-[var(--chart-3)]/20 text-[var(--chart-3)]',
    ARTIST: 'bg-[var(--chart-1)]/20 text-[var(--chart-1)]',
    PRODUCER: 'bg-[var(--chart-4)]/20 text-[var(--chart-4)]',
    ENGINEER: 'bg-[var(--chart-5)]/20 text-[var(--chart-5)]',
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Users</h1>

      {/* Desktop table view */}
      <div className="hidden md:block bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Email
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Username
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Activity
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {user.username || '—'}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        roleColors[user.role] || 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {user._count.articles} articles, {user._count.cypherEntries}{' '}
                      cyphers
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-8 text-center text-[var(--muted-foreground)]">No users found.</div>
        )}
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-medium text-[var(--foreground)] mb-1">{user.email}</div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  {user.username || 'No username'}
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  roleColors[user.role] || 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                }`}
              >
                {user.role}
              </span>
            </div>
            <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
              <div>{user._count.articles} articles, {user._count.cypherEntries} cyphers</div>
              <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-8 text-center text-[var(--muted-foreground)]">No users found.</div>
        )}
      </div>
    </div>
  );
}
