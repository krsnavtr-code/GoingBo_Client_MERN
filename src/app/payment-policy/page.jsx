import React from "react";

const PaymentPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold p-4">Payment Policy</h1>
        <p className="text-gray-600 p-4">Last updated: October 31, 2025</p>

        {/* Section 1 */}
        <section className="mb-8 p-4 bg-[var(--container-color-in)] rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">1. General Policy</h2>
          <p className="mb-4">
            This Payment Policy outlines the terms and conditions under which
            payments are processed for bookings made through{" "}
            <strong>Portfolio</strong>. By proceeding with a booking, you agree
            to comply with these payment terms.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">
            2. Accepted Payment Methods
          </h2>
          <p className="mb-4">We accept the following methods of payment:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Credit Cards (Visa, MasterCard, American Express)</li>
            <li>Debit Cards (issued by recognized banks)</li>
            <li>UPI and Net Banking (India only)</li>
            <li>
              Other secure digital payment options, as available on our site
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              All bookings require full or partial payment at the time of
              confirmation, as specified during checkout.
            </li>
            <li>
              For partial payments or installments, the remaining balance must
              be cleared by the due date mentioned in your booking details.
            </li>
            <li>
              Failure to make payment by the due date may result in automatic
              cancellation of your booking without prior notice.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">
            4. Pricing and Currency
          </h2>
          <p className="mb-4">
            All prices listed on our website are in{" "}
            <strong>Indian Rupees (INR)</strong>, unless otherwise stated. Taxes
            and additional charges, if applicable, will be clearly displayed
            before checkout.
          </p>
          <p>
            Prices are subject to change without prior notice and may vary based
            on availability, season, or currency fluctuations.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">5. Payment Security</h2>
          <p className="mb-4">
            We use secure payment gateways to ensure the protection of your
            personal and financial information. All transactions are encrypted
            and processed through trusted third-party payment providers.
          </p>
          <p>
            <strong>Portfolio</strong> does not store your credit/debit card
            information on our servers.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">
            6. Failed or Declined Payments
          </h2>
          <p className="mb-4">
            In the event of a failed or declined transaction, please contact
            your bank or payment provider for assistance. Bookings will not be
            confirmed until payment has been successfully received.
          </p>
          <p>
            If your payment fails but the amount is deducted from your account,
            it will be automatically refunded within{" "}
            <strong>5–7 business days</strong>.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">7. Refunds</h2>
          <p className="mb-4">
            Refunds, if applicable, will be processed in accordance with our{" "}
            <strong>Cancellation & Refund Policy</strong>. Refunds will only be
            issued to the original mode of payment used during booking.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">8. Chargebacks</h2>
          <p className="mb-4">
            Initiating a chargeback without valid reason may result in legal
            action. We encourage customers to contact our support team before
            raising any payment dispute with their bank.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mt-12 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-2">
            For any payment-related questions or concerns, please contact:
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

export default PaymentPolicy;
