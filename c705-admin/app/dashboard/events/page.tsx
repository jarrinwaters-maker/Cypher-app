'use client';

import { useEffect, useState } from 'react';
import { api, Event } from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await api.getEvents(50);
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-[var(--muted-foreground)]">Loading events...</div>;
  }

  if (error) {
    return <div className="text-[var(--destructive)]">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6"
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-2">
                {event.description}
              </p>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Starts: {new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              {event.endDate && (
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Ends: {new Date(event.endDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Host: {event.host.username || 'Unknown'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          No upcoming events found.
        </div>
      )}
    </div>
  );
}
