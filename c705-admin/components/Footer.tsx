'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 px-8 py-6 bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-6">
          <Link
            href="/terms"
            className="hover:text-gray-900 transition-colors"
          >
            Terms of Use
          </Link>
          <Link
            href="/privacy"
            className="hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="text-center sm:text-right">
          © C705 2024 • All rights reserved.
        </div>
      </div>
    </footer>
  );
}
