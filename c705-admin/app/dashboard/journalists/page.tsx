'use client';

import { useEffect, useState } from 'react';
import { api, JournalistInvite } from '@/lib/api';

export default function JournalistsPage() {
  const [journalists, setJournalists] = useState<any[]>([]);
  const [invites, setInvites] = useState<JournalistInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateInvite, setShowCreateInvite] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteExpires, setNewInviteExpires] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [journalistsData, invitesData] = await Promise.all([
        api.getJournalists(),
        api.getAllInvites(),
      ]);
      setJournalists(journalistsData as any[]);
      setInvites(invitesData);
    } catch (err: any) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createInvite({
        email: newInviteEmail || undefined,
        expiresAt: newInviteExpires || undefined,
      });
      setShowCreateInvite(false);
      setNewInviteEmail('');
      setNewInviteExpires('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create invite');
    }
  };

  if (isLoading) {
    return <div className="text-[var(--muted-foreground)]">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Journalists</h1>
        <button
          onClick={() => setShowCreateInvite(!showCreateInvite)}
          className="w-full sm:w-auto px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity text-sm sm:text-base"
        >
          + Create Invite Code
        </button>
      </div>

      {showCreateInvite && (
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[var(--foreground)]">Create Journalist Invite</h2>
          <form onSubmit={handleCreateInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="journalist@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Expires At (optional)
              </label>
              <input
                type="datetime-local"
                value={newInviteExpires}
                onChange={(e) => setNewInviteExpires(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateInvite(false)}
                className="px-4 py-2 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[var(--foreground)]">Active Journalists</h2>
          {journalists.length > 0 ? (
            <div className="space-y-3">
              {journalists.map((journalist) => (
                <div
                  key={journalist.id}
                  className="p-4 bg-[var(--muted)] rounded-[var(--radius-lg)]"
                >
                  <div className="font-medium text-[var(--foreground)]">
                    {journalist.email}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {journalist._count.articles} articles
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted-foreground)]">No journalists yet.</p>
          )}
        </div>

        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[var(--foreground)]">Invite Codes</h2>
          {invites.length > 0 ? (
            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className={`p-4 rounded-[var(--radius-lg)] ${
                    invite.used ? 'bg-[var(--muted)]' : 'bg-[var(--chart-2)]/20'
                  }`}
                >
                  <div className="font-mono text-sm font-medium mb-1 text-[var(--foreground)]">
                    {invite.accessCode}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {invite.email && `Email: ${invite.email}`}
                    {invite.used ? ' • Used' : ' • Available'}
                    {invite.expiresAt &&
                      ` • Expires: ${new Date(invite.expiresAt).toLocaleDateString()}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted-foreground)]">No invite codes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
