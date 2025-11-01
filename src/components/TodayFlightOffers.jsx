import React from "react";

const TodayFlightOffers = () => {
  const offers = [
    {
      id: 1,
      airline: "IndiGo",
      from: "Delhi",
      to: "Mumbai",
      price: "₹3,299",
      time: "Today, 3:45 PM",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/8b/IndiGo_Airlines_logo.svg",
    },
    {
      id: 2,
      airline: "Air India",
      from: "Bengaluru",
      to: "Delhi",
      price: "₹4,099",
      time: "Today, 6:15 PM",
      image:
        "https://upload.wikimedia.org/wikipedia/en/5/5b/Air_India_Logo.svg",
    },
    {
      id: 3,
      airline: "Vistara",
      from: "Hyderabad",
      to: "Pune",
      price: "₹2,899",
      time: "Today, 7:30 PM",
      image: "https://upload.wikimedia.org/wikipedia/en/9/9e/Vistara_logo.svg",
    },
    {
      id: 4,
      airline: "SpiceJet",
      from: "Chennai",
      to: "Goa",
      price: "₹3,049",
      time: "Today, 5:20 PM",
      image: "https://upload.wikimedia.org/wikipedia/en/0/0b/SpiceJet_logo.svg",
    },
  ];

  return (
    <div className="my-12 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-[var(--container-color-in)] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between"
          >
            <div className="flex flex-col items-center text-center">
              {/* <img
                src={offer.image}
                alt={offer.airline}
                className="w-20 h-20 object-contain mb-4"
              /> */}
              <h3 className="text-lg font-semibold mb-2">
                {offer.airline}
              </h3>
              <p className="text-sm mb-1">
                {offer.from} ➝ {offer.to}
              </p>
              <p className="text-xs">{offer.time}</p>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <p className="text-xl font-bold text-blue-600 mb-3">
                {offer.price}
              </p>
              <button className="px-5 py-2 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] text-sm font-medium hover:bg-[var(--button-hover-color)] cursor-pointer transition-all duration-200">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayFlightOffers;
