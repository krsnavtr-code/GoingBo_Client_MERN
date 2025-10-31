import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold p-4">Cancellation & Refund Policy</h1>
        <p className="text-gray-600 p-4">Last updated: October 31, 2025</p>

        <section className="mb-8 p-4 bg-[var(--container-color-in)] rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">1. General Policy</h2>
          <p className="mb-4">
            We understand that sometimes plans change. This Cancellation Policy
            outlines the terms under which cancellations and refunds will be
            processed for bookings made through <strong>Portfolio</strong>.
          </p>
          <p>
            By making a booking, you acknowledge and agree to the terms stated
            in this policy.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">
            2. Cancellation by Customer
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Cancellations made <strong>30 days or more</strong> prior to the
              start date of the trip will be eligible for a full refund, after
              deducting transaction and processing fees.
            </li>
            <li>
              Cancellations made between <strong>15–29 days</strong> prior to
              the start date will be subject to a{" "}
              <strong>50% cancellation fee</strong>.
            </li>
            <li>
              Cancellations made <strong>less than 15 days</strong> before the
              start date will not be eligible for any refund.
            </li>
          </ul>
          <p>
            Refunds, where applicable, will be processed within{" "}
            <strong>7–10 business days</strong> of receiving your cancellation
            request.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            3. Cancellation by Company
          </h2>
          <p className="mb-4">
            In rare cases, <strong>Portfolio</strong> may cancel or postpone a
            booking due to reasons such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Natural calamities, weather disruptions, or force majeure</li>
            <li>Insufficient participant numbers for a group package</li>
            <li>Operational or safety concerns</li>
          </ul>
          <p>
            In such cases, customers will be offered a full refund or the option
            to reschedule for a future date, based on availability.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">4. Refund Policy</h2>
          <p className="mb-4">
            Refunds will only be processed to the original mode of payment. No
            cash refunds will be provided.
          </p>
          <p>
            Any additional charges imposed by banks, payment gateways, or
            third-party platforms are non-refundable.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">5. No-Show Policy</h2>
          <p>
            If a customer fails to appear at the designated meeting point or on
            the date of travel without prior intimation, the booking will be
            treated as a <strong>no-show</strong> and no refund will be issued.
          </p>
        </section>

        <section className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">6. Unused Services</h2>
          <p>
            No refund shall be made for any unused or partially utilized
            services such as accommodations, meals, or sightseeing tours that
            were included in the booking.
          </p>
        </section>

        <section className="mb-8 bg-[var(--container-color-in)] p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            7. Force Majeure & Exceptional Circumstances
          </h2>
          <p>
            In events beyond our control such as natural disasters, political
            unrest, strikes, pandemics, or government restrictions,{" "}
            <strong>Portfolio</strong> shall not be liable for cancellations or
            refunds. We will, however, make all reasonable efforts to assist in
            rescheduling or offering credits for future use.
          </p>
        </section>

        <section className="mt-12 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-2">
            For questions regarding cancellations or refunds, please contact:
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

export default CancellationPolicy;
