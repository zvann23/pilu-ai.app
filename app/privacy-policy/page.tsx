import { PiluLogo } from "@/components/branding/logo";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy | Pilu" };

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__header">
        <PiluLogo size="small" />
        <Link href="/" className="article-reader__back">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Pilu
        </Link>
      </div>

      <article className="article-reader legal-page__content">
        <header>
          <span>Legal</span>
          <h1>Privacy Policy — Pilu</h1>
          <p>
            <strong>Effective date:</strong> [INSERT DATE]
            <br />
            <strong>Last updated:</strong> [INSERT DATE]
          </p>
        </header>

        <p className="legal-page__intro">
          This Privacy Policy explains how Pilu (&ldquo;Pilu,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          collects, uses, shares, and protects information when you use the Pilu application (the &ldquo;App&rdquo;). Pilu is
          developed by [INSERT LEGAL ENTITY NAME — e.g. Salmatek SRL / Salmatek PFA], based in Romania.
        </p>
        <p className="legal-page__intro">
          By using Pilu, you agree to the collection and use of information as described in this policy.
        </p>

        <section className="article-content-section">
          <h2>1. Who Pilu is for</h2>
          <p>
            Pilu is designed for parents and caregivers of children from pregnancy through approximately age 4.{" "}
            <strong>Pilu is intended to be used by adults</strong> — the account holder must be 18 years or older.
            Information about a child (your baby) is entered by you, the parent or caregiver, on the child&apos;s
            behalf. Pilu is not directed at children and does not knowingly collect information directly from
            children.
          </p>
        </section>

        <section className="article-content-section">
          <h2>2. Information we collect</h2>
          <p><strong>2.1 Account information</strong></p>
          <ul>
            <li>Name, email address, and profile photo (if provided via Google Sign-In)</li>
            <li>Authentication data (via Supabase Auth — email/password or Google OAuth)</li>
          </ul>
          <p><strong>2.2 Family and baby information</strong></p>
          <ul>
            <li>Family/household structure, including other parents or caregivers you invite to share access</li>
            <li>Baby profile details: name, date of birth, sex</li>
            <li>Feeding, sleep, and diaper logs</li>
            <li>Growth measurements and milestones</li>
            <li>Vaccine and medicine records</li>
            <li>Photos and entries you add to the Memory Book or Daily Journal</li>
            <li>Notes, entries, and any other content you choose to record in the App</li>
          </ul>
          <p><strong>2.3 Conversations with Ask Pilu</strong></p>
          <ul>
            <li>Questions and messages you send to Pilu&apos;s AI assistant, and the context needed to answer them (e.g. your baby&apos;s age, relevant logged data)</li>
          </ul>
          <p><strong>2.4 Subscription and billing information</strong></p>
          <ul>
            <li>Subscription tier (Free, Elite, or Premium) and billing status</li>
            <li>
              Payments for Elite/Premium subscriptions are processed by <strong>Google Play Billing</strong> — Pilu
              does not receive or store your payment card details. Google&apos;s own privacy policy governs the
              payment transaction itself.
            </li>
          </ul>
          <p><strong>2.5 Usage and device information</strong></p>
          <ul>
            <li>Basic technical information (device type, app version, crash logs) to help us maintain and improve the App</li>
          </ul>
        </section>

        <section className="article-content-section">
          <h2>3. How we use your information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide the App&apos;s core features (tracking, timeline, reminders, family sharing, Sleep Sounds, etc.)</li>
            <li>Power the Ask Pilu assistant, including sending relevant context to our AI provider (Google Gemini — see Section 4) to generate responses</li>
            <li>Process and manage Elite/Premium subscriptions</li>
            <li>Send you notifications you&apos;ve opted into (e.g. reminders, family activity updates)</li>
            <li>Maintain the security, integrity, and reliability of the App</li>
            <li>Improve and develop new features</li>
          </ul>
          <p>We do <strong>not</strong> sell your personal information or your child&apos;s information to third parties, and we do not use it for advertising.</p>
        </section>

        <section className="article-content-section">
          <h2>4. How we share information</h2>
          <p>We share information only as needed to operate the App:</p>
          <div className="legal-page__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Purpose</th>
                  <th>Data involved</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Supabase</strong></td>
                  <td>Database hosting and authentication (hosted in the EU)</td>
                  <td>All account, family, and baby data</td>
                </tr>
                <tr>
                  <td><strong>Google (Gemini API)</strong></td>
                  <td>Powers the Ask Pilu assistant</td>
                  <td>Your questions and the context needed to answer them</td>
                </tr>
                <tr>
                  <td><strong>Google (Sign-In)</strong></td>
                  <td>Optional sign-in method</td>
                  <td>Name, email, profile photo</td>
                </tr>
                <tr>
                  <td><strong>Google Play Billing</strong></td>
                  <td>Processes Elite/Premium subscription payments</td>
                  <td>Subscription status; payment details are handled entirely by Google</td>
                </tr>
                <tr>
                  <td><strong>Vercel</strong></td>
                  <td>Application hosting</td>
                  <td>Technical/usage data needed to serve the App</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            We require these providers to handle your data securely and only for the purposes described here. We do
            not share your family&apos;s or baby&apos;s data with any other parent, caregiver, or family beyond the
            one you explicitly create or join.
          </p>
        </section>

        <section className="article-content-section">
          <h2>5. Family sharing</h2>
          <p>
            If you invite other parents or caregivers to your family in Pilu, they will be able to see the baby
            profile(s) and logged data associated with that family, based on the permissions of their role. Only
            invite people you trust with this information.
          </p>
        </section>

        <section className="article-content-section">
          <h2>6. Data retention</h2>
          <p>
            We retain your information for as long as your account is active, or as needed to provide the App&apos;s
            features (for example, keeping your baby&apos;s timeline and memories available to you over time). If
            you delete your account, we delete or anonymize your personal data within [INSERT TIMEFRAME — e.g. 30
            days], except where we are required to retain certain records by law.
          </p>
        </section>

        <section className="article-content-section">
          <h2>7. Your rights</h2>
          <p>
            If you are located in the European Economic Area, the United Kingdom, or another jurisdiction with
            similar protections, you have the right to:
          </p>
          <ul>
            <li><strong>Access</strong> the personal data we hold about you and your family</li>
            <li><strong>Correct</strong> inaccurate data</li>
            <li><strong>Delete</strong> your account and associated data (&ldquo;right to erasure&rdquo;)</li>
            <li><strong>Export</strong> your data in a portable format (&ldquo;right to data portability&rdquo;)</li>
            <li><strong>Object to or restrict</strong> certain processing</li>
            <li><strong>Withdraw consent</strong> at any time where processing is based on consent</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at [INSERT CONTACT EMAIL]. We will respond within the
            timeframe required by applicable law.
          </p>
        </section>

        <section className="article-content-section">
          <h2>8. Security</h2>
          <p>
            We use industry-standard measures to protect your information, including encryption in transit,
            row-level security policies restricting data access to authorized family members only, and secure
            authentication. No method of storage or transmission is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section className="article-content-section">
          <h2>9. International data transfers</h2>
          <p>
            Our primary database is hosted in the European Union (Frankfurt, via Supabase). Some service providers
            (such as Google, for Gemini AI and Sign-In) may process data outside the EU/EEA. Where this occurs, we
            rely on appropriate safeguards required by applicable data protection law.
          </p>
        </section>

        <section className="article-content-section">
          <h2>10. Children&apos;s privacy</h2>
          <p>
            Pilu is a tool for parents and caregivers, not a service directed at or marketed to children. We do not
            knowingly allow children to create accounts or interact directly with the App. Information about a
            child is provided by their parent or legal guardian, who is responsible for the accuracy and
            appropriateness of what they record.
          </p>
        </section>

        <section className="article-content-section">
          <h2>11. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you in
            the App or by email before the changes take effect. The &ldquo;Last updated&rdquo; date at the top of
            this page reflects the most recent revision.
          </p>
        </section>

        <section className="article-content-section">
          <h2>12. Contact us</h2>
          <p>If you have questions about this Privacy Policy or how your data is handled, contact us at:</p>
          <p className="legal-page__contact">
            [INSERT CONTACT EMAIL]
            <br />
            [INSERT LEGAL ENTITY NAME AND ADDRESS, IF APPLICABLE]
          </p>
        </section>

        <p className="library-disclaimer">
          <em>
            This document is a starting draft based on Pilu&apos;s current features. It should be reviewed by a
            qualified lawyer before publishing — particularly the sections on data retention timeframes,
            international transfers, and your specific obligations under Romanian/EU law (GDPR) — before this is
            treated as your final, binding policy.
          </em>
        </p>
      </article>
    </div>
  );
}
