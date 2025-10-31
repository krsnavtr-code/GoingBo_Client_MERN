import React from "react";
import Link from "next/link";

const TermsPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold p-4">Terms & Conditions Policy</h1>
        <p className="text-gray-600 p-4">Last updated: October 13, 2025</p>

        <section className="p-4">
          <p className="mb-4">
            The itinerary is fixed and cannot be modified. Transportation shall
            be provided as per the itinerary and will not be at disposal. For
            any paid activity which is non-operational due to any unforeseen
            reason, we will process a refund, and the same should reach the
            guest within 30 days of processing the refund.
          </p>

          <p className="mb-4">
            Also, for any activity which is complimentary and not charged to
            Goingbo & guest, no refund will be processed.
          </p>

          <p className="mb-4">
            Entrance fee, parking, and guide charges are not included in the
            packages.
          </p>

          <p className="mb-4">
            If your flights involve a combination of different airlines, you may
            have to collect your luggage on arrival at the connecting hub and
            register it again while checking in for the onward journey to your
            destination.
          </p>

          <p className="mb-4">
            Booking rates are subject to change without prior notice.
          </p>

          <p className="mb-4">
            Airline seats and hotel rooms are subject to availability at the
            time of booking.
          </p>

          <p className="mb-4">
            Pricing of the booking is based on the age of the passengers. Please
            make sure you enter the correct age of passengers at the time of
            booking. Passengers furnishing incorrect age details may incur a
            penalty at the time of travelling.
          </p>

          <p className="mb-4">
            In case of unavailability in the listed hotels, arrangement for an
            alternate accommodation will be made in a hotel of similar standard.
          </p>

          <p className="mb-4">
            In case your package needs to be cancelled due to any natural
            calamity, weather conditions etc., Goingbo shall strive to give you
            the maximum possible refund subject to the agreement made with our
            trade partners/vendors.
          </p>

          <p className="mb-4">
            Goingbo reserves the right to modify the itinerary at any point, due
            to reasons including but not limited to: Force Majeure events,
            strikes, fairs, festivals, weather conditions, traffic problems,
            overbooking of hotels/flights, cancellation/re-routing of flights,
            closure of/entry restrictions at a place of visit, etc. While we
            will do our best to make suitable alternate arrangements, we would
            not be held liable for any refunds/compensation claims arising out
            of this.
          </p>

          <p className="mb-4">
            Certain hotels may ask for a security deposit during check-in, which
            is refundable at check-out subject to the hotel policy.
          </p>

          <p className="mb-4">
            The booking price does not include: expenses of personal nature,
            such as laundry, telephone calls, room service, alcoholic beverages,
            mini bar charges, tips, portage, camera fees, etc.
          </p>

          <p className="mb-4">
            Any other items not mentioned under "Inclusions" are not included in
            the cost of the booking.
          </p>

          <p className="mb-4">
            The package price does not include mandatory gala dinner charges
            levied by the hotels especially during New Year, Christmas, or any
            special occasions. Goingbo shall try to communicate the same while
            booking the package; however, Goingbo may not have this information
            readily available all the time.
          </p>

          <p className="mb-4">
            Cost of deviation and cost of extension of the validity on your
            ticket is not included.
          </p>

          <p className="mb-4">
            For queries regarding cancellations and refunds, please refer to our{" "}
            <Link
              href="/cancellation-policy"
              className="text-blue-600 font-bold hover:underline"
            >
              Cancellation Policy
            </Link>
            .
          </p>

          <p className="mb-4">
            Disputes, if any, shall be subject to the exclusive jurisdiction of
            the courts in New Delhi.
          </p>

          <p>
            The cost of mentioned tours and transfer is not valid between 6 PM
            to 8 AM.
          </p>
        </section>

        <section className="mt-12 pt-6 border-t border-gray-200 p-4">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-2">
            If you have any questions about these Terms & Conditions, please
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
            <Link
              href="/contact"
              className="text-blue-600 font-bold hover:underline"
            >
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
