export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6 sm:mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">1. Information We Collect</h2>
            <p className="text-[var(--foreground)] mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
              <li>Account information (email, username)</li>
              <li>Content you create (tracks, cyphers, articles)</li>
              <li>Payment information (processed securely through Apple)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">2. How We Use Your Information</h2>
            <p className="text-[var(--foreground)] mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">3. Data Usage Explanation</h2>
            <p className="text-[var(--foreground)] mb-4">
              Your data is used solely to provide and improve the C705 platform. We do not sell your personal information to third parties. Audio content you upload is stored securely and used only within the app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">4. User Rights</h2>
            <p className="text-[var(--foreground)] mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-[var(--foreground)] mb-4">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of certain data collection</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">5. Data Security</h2>
            <p className="text-[var(--foreground)] mb-4">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">6. Contact Information</h2>
            <p className="text-[var(--foreground)] mb-4">
              For questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-[var(--foreground)]">
              <strong>Email:</strong> privacy@c705.com<br />
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
