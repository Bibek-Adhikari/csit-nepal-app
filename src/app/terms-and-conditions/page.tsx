import type { Metadata } from "next";
import { BackNav } from "@/components/back-nav";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions for using the BCA Nepal app.",
};

export default function TermsPage() {
  return (
    <>
      <BackNav href="/profile" label="Profile" />
      <section className="welcome-hero">
        <h2>Terms and Conditions</h2>
        <p>Last updated: June 2026</p>
      </section>

      <div className="legal-content">
        <h3>1. Acceptance</h3>
        <p>By using BCA Nepal, you agree to these terms. This app is a study helper for Tribhuvan University BCA students.</p>

        <h3>2. Content</h3>
        <ul>
          <li>Study notes and PDFs are shared for <strong>educational purposes only</strong></li>
          <li>Content belongs to respective authors and TU. We do not claim ownership</li>
          <li>Notes may contain errors — always verify with official textbooks</li>
          <li>We are not affiliated with Tribhuvan University</li>
        </ul>

        <h3>3. User Conduct</h3>
        <p>You agree to:</p>
        <ul>
          <li>Use the app for personal study purposes only</li>
          <li>Not redistribute paid or copyrighted content</li>
          <li>Not attempt to hack, exploit, or disrupt the app</li>
        </ul>

        <h3>4. Offline Content</h3>
        <p>PDFs saved offline are for your personal use. Downloaded content should not be shared or redistributed.</p>

        <h3>5. No Warranty</h3>
        <p>This app is provided &quot;as is&quot; without warranties. We do not guarantee:</p>
        <ul>
          <li>Accuracy of study materials</li>
          <li>Uninterrupted app availability</li>
          <li>Exam results based on our content</li>
        </ul>

        <h3>6. Limitation</h3>
        <p>BCA Nepal is a free educational tool. We are not liable for any damages arising from use of this app.</p>

        <h3>7. Changes</h3>
        <p>We may update these terms at any time. Continued use after changes constitutes acceptance.</p>

        <h3>8. Contact</h3>
        <p>For questions, reach us via our <a href="https://www.facebook.com/groups/2295735577582143" target="_blank" rel="noopener noreferrer">Facebook group</a> or <a href="https://chat.whatsapp.com/GGTejd8pl941L6JCTGJzxd" target="_blank" rel="noopener noreferrer">WhatsApp community</a>.</p>
      </div>
    </>
  );
}
