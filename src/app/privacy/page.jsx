import React from "react";
import Link from "next/link";

const PrivacyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold p-4">Privacy Policy</h1>
        <p className="text-gray-600 p-4">Last updated: October 13, 2025</p>

        <section className="p-4">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            At Profacenal, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">We may collect, use, store, and transfer different kinds of personal data about you, which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username, or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
            <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
          </ul>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
          <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4">
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process your personal data, and whether we can achieve those purposes through other means.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">6. Your Legal Rights</h2>
          <p className="mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
          <p className="mb-4">
            Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mt-12 pt-6 border-t border-gray-200 p-4">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-2">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-2">
            Email:{" "}
            <a
              href="mailto:krishna.trivixa@zohomail.in"
              className="text-blue-600 font-bold hover:underline"
            >
              krishna.trivixa@zohomail.in
            </a>
          </p>
          <p>
            Or through our{" "}
            <Link href="/contact" className="text-blue-600 font-bold hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
