import React from "react";
import Link from "next/link";

const TermsPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold p-4">Terms and Conditions</h1>
        <p className="text-gray-600 p-4">Last updated: October 13, 2025</p>

        <section className="p-4">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Portfolio. These Terms and Conditions outline the rules
            and regulations for the use of our portfolio website.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and
            conditions. Do not continue to use Portfolio if you do
            not agree to all of the terms and conditions stated on this page.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            2. Intellectual Property
          </h2>
          <p className="mb-4">
            The content, layout, design, data, and graphics on this website are
            protected by intellectual property laws and are the property of
            Portfolio. Unless otherwise stated, all rights are reserved.
          </p>
          <p>
            You may view and/or print pages from this website for your own
            personal use, subject to restrictions set in these terms and
            conditions.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">3. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the
            materials on Portfolio for personal, non-commercial
            transitory viewing only.
          </p>
          <p className="mb-4">
            This is the grant of a license, not a transfer of title, and under
            this license, you may not:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>
              Attempt to reverse engineer any software contained on the website
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">4. Disclaimer</h2>
          <p className="mb-4">
            The materials on Portfolio are provided on an 'as is'
            basis. Portfolio makes no warranties, expressed or implied, and
            hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">5. Limitations</h2>
          <p>
            In no event shall Portfolio or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on Portfolio, even if Portfolio or a Portfolio authorized representative has been
            notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            6. Revisions and Errata
          </h2>
          <p>
            The materials appearing on Portfolio could include
            technical, typographical, or photographic errors. Portfolio does
            not warrant that any of the materials on its website are accurate,
            complete, or current. Portfolio may make changes to the materials
            contained on its website at any time without notice.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">7. Links</h2>
          <p className="mb-4">
            Portfolio has not reviewed all of the sites linked to its website
            and is not responsible for the contents of any such linked site. The
            inclusion of any link does not imply endorsement by Portfolio of
            the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
          <p className="mb-4">
            Profacenal may revise these terms of service for its website at any
            time without notice. By using this website you are agreeing to be
            bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws of India and you irrevocably
            submit to the exclusive jurisdiction of the location.
          </p>
        </section>

        <section className="mt-12 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-2">
            If you have any questions about these Terms and Conditions, please
            contact us at:
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

export default TermsPage;
