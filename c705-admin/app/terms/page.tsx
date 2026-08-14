export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Terms of Use</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[var(--foreground)] mb-4">
              By accessing and using the C705 application, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">2. Use License</h2>
            <p className="text-[var(--foreground)] mb-4">
              Permission is granted to temporarily download one copy of C705 for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">3. User Content</h2>
            <p className="text-[var(--foreground)] mb-4">
              You are responsible for all content you post, upload, or otherwise make available through C705. You agree not to post content that is illegal, harmful, or violates the rights of others.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">4. Subscription Rules</h2>
            <p className="text-[var(--foreground)] mb-4">
              Subscriptions are billed on a recurring basis. You may cancel your subscription at any time through your account settings. Refunds are subject to our refund policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">5. Contact Information</h2>
            <p className="text-[var(--foreground)] mb-4">
              For questions about these Terms of Use, please contact us at:
            </p>
            <p className="text-[var(--foreground)]">
              <strong>Email:</strong> support@c705.com<br />
              <strong>Company:</strong> C705<br />
            </p>
          </section>

          <section className="mb-8">
            <p className="text-sm text-[var(--muted-foreground)]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
