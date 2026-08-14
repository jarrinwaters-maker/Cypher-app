'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CyphersPage() {
  const [cyphers, setCyphers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCyphers();
  }, []);

  const loadCyphers = async () => {
    try {
      const data = await api.getCyphers();
      setCyphers((data as any).cyphers || []);
    } catch (err: any) {
      console.error('Error loading cyphers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-[var(--muted-foreground)]">Loading cyphers...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Cyphers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cyphers.map((cypher) => (
          <div
            key={cypher.id}
            className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6"
          >
            <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-2">
              {cypher.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-2">
              {cypher.description || 'No description'}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-[var(--muted-foreground)]">
              <span>
                {cypher.isActive ? '🟢 Active' : '🔴 Inactive'}
              </span>
              <span>
                {new Date(cypher.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      {cyphers.length === 0 && (
        <div className="text-center text-[var(--muted-foreground)] py-12">
          No cyphers found.
        </div>
      )}
    </div>
  );
}
