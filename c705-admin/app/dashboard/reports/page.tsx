'use client';

import { useEffect, useState } from 'react';
import { api, Report } from '@/lib/api';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await api.getReports();
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (reportId: string, action: 'dismiss' | 'resolve') => {
    try {
      await api.resolveReport(reportId, action);
      await loadReports();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCypher = async (cypherId: string) => {
    if (!confirm('Are you sure you want to delete this cypher? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteCypher(cypherId);
      await loadReports();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return <div className="text-[var(--muted-foreground)]">Loading reports...</div>;
  }

  if (error) {
    return <div className="text-[var(--destructive)]">Error: {error}</div>;
  }

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status !== 'pending');

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Content Reports</h1>

      {pendingReports.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Pending Reports ({pendingReports.length})
          </h2>
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2">
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {report.entry?.cypher.title || report.cypher?.title || 'Unknown Content'}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)] font-mono mt-1">
                        {report.entry?.cypher.id || report.cypher?.id || 'N/A'}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)] mb-2">
                      <strong>Reason:</strong> {report.reason}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      Reported by: {report.user.email} • {new Date(report.createdAt).toLocaleString()}
                    </div>
                    {report.entry?.user && (
                      <div className="text-xs text-[var(--muted-foreground)] mt-1">
                        Content creator: {report.entry.user.username || report.entry.user.email}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleResolve(report.id, 'dismiss')}
                      className="px-4 py-2 bg-[var(--muted)] text-[var(--foreground)] rounded-[var(--radius-lg)] hover:bg-[var(--accent)] transition-colors text-sm font-medium"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, 'resolve')}
                      className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      Resolve
                    </button>
                    {(report.entry?.cypher.id || report.cypher?.id) && (
                      <button
                        onClick={() => handleDeleteCypher(report.entry?.cypher.id || report.cypher?.id || '')}
                        className="px-4 py-2 bg-[var(--destructive)] text-[var(--destructive-foreground)] rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        Delete Cypher
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolvedReports.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Resolved Reports ({resolvedReports.length})
          </h2>
          <div className="space-y-4">
            {resolvedReports.map((report) => (
              <div
                key={report.id}
                className="bg-[var(--muted)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {report.entry?.cypher.title || report.cypher?.title || 'Unknown Content'}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-1">
                      {report.reason} • {new Date(report.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-[var(--accent)] text-[var(--foreground)] rounded-full">
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reports.length === 0 && (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          No reports found.
        </div>
      )}
    </div>
  );
}
