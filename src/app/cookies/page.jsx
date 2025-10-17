import React from "react";

const CookiePolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold p-4">Cookie Policy</h1>
        <p className="text-gray-600 p-4">Last updated: October 17, 2025</p>

        <section className="p-4">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            This Cookie Policy explains how Profacenal ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website. By using our website, you consent to the use of cookies in accordance with this policy.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies</h2>
          <p className="mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the website owners.
          </p>
          <p>
            Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Cookies</h2>
          <p className="mb-4">We use cookies for various purposes, including:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off.</li>
            <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website.</li>
            <li><strong>Functionality Cookies:</strong> These enable enhanced functionality and personalization.</li>
            <li><strong>Analytics Cookies:</strong> These help us understand how effective our content is and improve our website.</li>
          </ul>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
          <p className="mb-4">
            We may also use various third-party cookies to report usage statistics of the service, deliver advertisements, and so on. These cookies may be used when you share information using a social media sharing button on our website.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">5. Your Choices Regarding Cookies</h2>
          <p className="mb-4">
            You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>
          <p className="mb-4">
            Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. The "Help" or "Settings" section of most browsers provides information on how to manage cookies.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top of this Cookie Policy. You are advised to review this Cookie Policy periodically for any changes.
          </p>
        </section>

        <section className="mt-12 pt-6 border-t border-gray-200 p-4">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-2">
            If you have any questions about this Cookie Policy, please contact us at:
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
        </section>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
