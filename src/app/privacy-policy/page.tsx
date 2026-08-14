import type { Metadata } from "next";
import { BackNav } from "@/components/back-nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for CSIT Nepal app. Learn how we handle your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BackNav href="/profile" label="Profile" />
      <section className="welcome-hero">
        <h2>Privacy Policy</h2>
        <p>Last updated: June 2026</p>
      </section>

      <div className="legal-content">
        <h3>1. Data We Collect</h3>
        <p>CSIT Nepal is a study helper app for Tribhuvan University BSc CSIT students. We collect minimal data:</p>
        <ul>
          <li><strong>Study progress</strong> — completed units and bookmarks stored locally on your device (never sent to our servers)</li>
          <li><strong>Offline PDFs</strong> — downloaded notes stored in your browser&apos;s IndexedDB for offline access</li>
          <li><strong>Device storage info</strong> — used to show offline storage usage in the app</li>
        </ul>

        <h3>2. How We Use Your Data</h3>
        <p>All your study data stays on your device. We do not collect, transmit, or sell any personal information. Your progress, bookmarks, and downloaded PDFs are entirely local.</p>

        <h3>3. Third-Party Services</h3>
        <ul>
          <li><strong>Supabase</strong> — hosts our study notes and PDFs (content delivery only)</li>
          <li><strong>YouTube</strong> — embedded lecture videos via YouTube IFrame API</li>
          <li><strong>Sentry</strong> — anonymous error reporting to help us fix bugs (no personal data collected)</li>
        </ul>

        <h3>4. Cookies and Storage</h3>
        <p>We use browser storage (localStorage, IndexedDB) to save your preferences and offline content. No tracking cookies are used.</p>

        <h3>5. Children&apos;s Privacy</h3>
        <p>This app is designed for university students (18+). We do not knowingly collect data from children.</p>

        <h3>6. Changes to This Policy</h3>
        <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

        <h3>7. Contact</h3>
        <p>For questions about this privacy policy, contact us via our <a href="https://www.facebook.com/groups/2295735577582143" target="_blank" rel="noopener noreferrer">Facebook group</a> or <a href="https://chat.whatsapp.com/GGTejd8pl941L6JCTGJzxd" target="_blank" rel="noopener noreferrer">WhatsApp community</a>.</p>
      </div>
    </>
  );
}
