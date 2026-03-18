export default function Privacy() {
  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#720110] to-black">
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="text-sm uppercase tracking-widest mb-12 inline-block transition-colors text-secondary hover:text-white"
        >
          ← Back
        </a>

        <h1 className="text-4xl font-black text-white mb-2 tracking-[0.15em]">
          PRIVACY POLICY
        </h1>
        <div className="w-16 h-px mb-10 bg-primary" />

        <div className="space-y-10 text-secondary">
          <section>
            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-widest">
              Overview
            </h2>
            <p className="leading-relaxed">
              Leader Finder is designed with privacy in mind. We do not collect,
              store, or share any personal information. This policy explains what (if
              anything) is gathered when you use the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-widest">
              Data We Do Not Collect
            </h2>
            <p className="leading-relaxed">
              We do not collect your name, email address, location, device identifiers, or
              any other personally identifiable information. The app does not require an
              account and does not track your activity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-widest">
              Local Storage
            </h2>
            <p className="leading-relaxed">
              Any preferences or filter settings you configure in the app are stored
              locally on your device only. This data never leaves your device and is not
              accessible to us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-widest">
              Third-Party Services
            </h2>
            <p className="leading-relaxed">
              The app may be distributed through the Apple App Store, which has its own
              privacy practices. We encourage you to review{" "}
              <span className="text-white">Apple's Privacy Policy</span> for information
              on how they handle data related to app downloads and usage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-widest">
              Children's Privacy
            </h2>
            <p className="leading-relaxed">
              This app is not directed at children under 13. We do not knowingly collect
              any information from children. Since no data is collected from any user,
              this applies equally to all age groups.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-widest">
              Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be
              reflected here with an updated date. Continued use of the app after changes
              are posted constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-widest">
              Contact
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please reach out via
              the App Store listing.
            </p>
          </section>
        </div>

        <p className="mt-16 text-xs text-muted">
          Last updated: March 2026
        </p>
      </div>
    </main>
  );
}
