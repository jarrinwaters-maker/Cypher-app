'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    iconPath: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
  },
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  },
  { 
    name: 'Articles', 
    href: '/dashboard/articles', 
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  },
  { 
    name: 'Cyphers', 
    href: '/dashboard/cyphers', 
    iconPath: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
  },
  { 
    name: 'Events', 
    href: '/dashboard/events', 
    iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  },
  { 
    name: 'Journalist Invites', 
    href: '/dashboard/journalists', 
    iconPath: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#1a1d29] min-h-screen h-full flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
      {/* Header with Logo */}
      <div className="flex items-center p-6 border-b border-gray-800 gap-3">
        <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-base">C</span>
        </div>
        <h1 className="text-lg font-bold text-white">
          <span className="font-normal">705</span> Admin
        </h1>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors relative ${
                isActive
                  ? 'text-[#1e3a8a]'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {/* Active background with rounded right corners only */}
              {isActive && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1e3a8a]" />
                  <div className="absolute left-0 right-0 top-0 bottom-0 bg-blue-100 rounded-r-md" />
                </>
              )}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  <svg className={`w-5 h-5 ${isActive ? 'text-[#1e3a8a]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                    {item.name === 'Settings' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </div>
                <span className={isActive ? 'text-[#1e3a8a] font-medium' : 'text-gray-400'}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Utility Links */}
      <div className="px-4 py-4 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span>View Site</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
