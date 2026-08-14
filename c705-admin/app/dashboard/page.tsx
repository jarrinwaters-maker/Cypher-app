'use client';

import { useEffect, useState } from 'react';
import { api, DashboardStats, Report, RecentCypher, JournalistInvite } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [recentCyphers, setRecentCyphers] = useState<RecentCypher[]>([]);
  const [invites, setInvites] = useState<JournalistInvite[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateInvite, setShowCreateInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dashboardStats, reportsData, recentCyphersData, invitesData, eventsData] = await Promise.all([
        api.getDashboard(),
        api.getReports().catch(() => []),
        api.getRecentCyphers(4).catch(() => []),
        api.getUnusedInvites().catch(() => []),
        api.getEvents(6).catch(() => []),
      ]);
      
      setStats(dashboardStats);
      setReports(reportsData);
      setRecentCyphers(recentCyphersData);
      setInvites(invitesData);
      setEvents(eventsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    try {
      setIsCreatingInvite(true);
      const invite = await api.createInvite({ email: inviteEmail });
      setGeneratedCode(invite.accessCode);
      setInviteEmail('');
      await loadDashboardData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const handleResolveReport = async (reportId: string, action: 'dismiss' | 'resolve') => {
    try {
      await api.resolveReport(reportId, action);
      await loadDashboardData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCypher = async (cypherId: string) => {
    if (!confirm('Are you sure you want to delete this cypher?')) return;
    
    try {
      await api.deleteCypher(cypherId);
      await loadDashboardData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--muted-foreground)]">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600 font-medium">Error: {error}</div>
      </div>
    );
  }

  if (!stats) return null;

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gray-100 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="text-sm text-blue-600 font-medium">
            G771, is in month!
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-2">Total users</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.stats.totalUsers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-2">Active Journalists</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.stats.journalists}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-2">Live cyphers</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.stats.activeCyphers}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-2">Upcoming events</p>
          <p className="text-3xl font-bold text-gray-900">
            {events.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journalist Access Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Journalist Access
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Generate invite code, for active invitelet,
          </p>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={generatedCode || (invites.length > 0 ? invites[0].accessCode : 'GV8X2QYD')}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 font-mono"
            />
            <button 
              onClick={async () => {
                if (!generatedCode) {
                  await handleCreateInvite();
                }
              }}
              disabled={isCreatingInvite}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isCreatingInvite ? 'Generating...' : 'Search'}
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900 mb-3">Pending Journalist Invites</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-500 font-medium">Code</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Email</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Expires &gt;</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.slice(0, 4).map((invite) => (
                    <tr key={invite.id} className="border-b border-gray-100">
                      <td className="py-2 font-mono text-gray-900">{invite.accessCode}</td>
                      <td className="py-2 text-gray-600">{invite.email ? `${invite.email.substring(0, 10)}...` : 'No email'}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {invite.expiresAt ? new Date(invite.expiresAt).toLocaleDateString() : 'Un.sed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {invites.length > 4 && (
              <Link
                href="/dashboard/journalists"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                -- View mvrent codes
              </Link>
            )}
          </div>
        </div>

        {/* Content Moderation Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Content Moderation
          </h3>
          
          {pendingReportsCount > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-gray-800">
                {pendingReportsCount} Reports to Review
              </span>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <Link
              href="/dashboard/reports"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium text-center"
            >
              Review Reports
            </Link>
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium">
              Remove Cyphers
            </button>
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium">
              Unpublish Articles
            </button>
          </div>

          {reports.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-900">Suspicious Cypher</div>
              {reports.slice(0, 1).map((report) => (
                <div key={report.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/cyphers/${report.entry?.cypher.id || report.cypher?.id}`}
                      className="text-blue-600 hover:underline font-mono text-sm"
                    >
                      {report.entry?.cypher.id || report.cypher?.id || 'CN75X35YN'}
                    </Link>
                    <button
                      onClick={() => handleDeleteCypher(report.entry?.cypher.id || report.cypher?.id || '')}
                      className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      Revoke
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {report.entry?.user.username || 'A rapper123'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {report.entry?.cypher.title || 'Drenk Trap Beat'}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>102</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>744</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span>00</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Cyphers */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Cyphers
          </h2>
          <Link
            href="/dashboard/cyphers"
            className="text-sm text-blue-600 hover:underline"
          >
            View All &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentCyphers.map((cypher) => (
            <div
              key={cypher.id}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="w-full h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>
              <div className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                {cypher.title}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {cypher.artist} {cypher.beatType}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>{cypher.entryCount} entries</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{cypher.playCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
