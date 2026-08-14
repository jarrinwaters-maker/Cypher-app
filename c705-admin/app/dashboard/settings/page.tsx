'use client';

import { useAuth } from '@/lib/auth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-[var(--muted-foreground)] mb-1">
                {user?.email || 'admin@C705.com'}
              </div>
              {user?.role && (
                <div className="text-lg font-semibold text-[var(--foreground)] mt-1">
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-[var(--radius-lg)] text-sm text-[var(--muted-foreground)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Role
              </label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="w-full px-3 py-2 bg-[var(--input-background)] border border-[var(--border)] rounded-[var(--radius-lg)] text-sm text-[var(--muted-foreground)]"
              />
            </div>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">App Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[var(--foreground)]">Maintenance Mode</div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  Enable maintenance mode to temporarily disable the app
                </div>
              </div>
              <button className="px-4 py-2 bg-[var(--muted)] text-[var(--foreground)] rounded-[var(--radius-lg)] hover:bg-[var(--accent)] transition-colors text-sm font-medium">
                Coming Soon
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[var(--foreground)]">Email Notifications</div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  Receive email alerts for important events
                </div>
              </div>
              <button className="px-4 py-2 bg-[var(--muted)] text-[var(--foreground)] rounded-[var(--radius-lg)] hover:bg-[var(--accent)] transition-colors text-sm font-medium">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-[var(--foreground)] mb-2">
                Clear All Data
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mb-3">
                This action cannot be undone. This will permanently delete all data.
              </div>
              <button
                disabled
                className="px-4 py-2 bg-[var(--destructive)]/10 text-[var(--destructive)] rounded-[var(--radius-lg)] hover:bg-[var(--destructive)]/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
