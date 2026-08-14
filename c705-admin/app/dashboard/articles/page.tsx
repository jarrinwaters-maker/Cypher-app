'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await api.getArticles();
      setArticles((data as any).articles || []);
    } catch (err: any) {
      console.error('Error loading articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.deleteArticle(id);
      loadArticles();
    } catch (err: any) {
      alert(err.message || 'Failed to delete article');
    }
  };

  if (isLoading) {
    return <div className="text-[var(--muted-foreground)]">Loading articles...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Articles</h1>

      {/* Desktop table view */}
      <div className="hidden md:block bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-[var(--border)]">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Title
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  City
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Author
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Created
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-[var(--muted)]/50 transition-colors">
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {article.title}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-[var(--muted-foreground)]">{article.city}</div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {article.author?.email || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-[var(--destructive)] hover:opacity-80 transition-opacity"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {articles.length === 0 && (
          <div className="p-8 text-center text-[var(--muted-foreground)]">No articles found.</div>
        )}
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4"
          >
            <div className="font-medium text-[var(--foreground)] mb-2">{article.title}</div>
            <div className="space-y-1 text-sm text-[var(--muted-foreground)] mb-3">
              <div>City: {article.city}</div>
              <div>Author: {article.author?.email || 'Unknown'}</div>
              <div>Created: {new Date(article.createdAt).toLocaleDateString()}</div>
            </div>
            <button
              onClick={() => handleDelete(article.id)}
              className="w-full px-4 py-2 text-sm font-medium text-[var(--destructive)] bg-[var(--destructive)]/10 rounded-[var(--radius-lg)] hover:bg-[var(--destructive)]/20 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="p-8 text-center text-[var(--muted-foreground)]">No articles found.</div>
        )}
      </div>
    </div>
  );
}
