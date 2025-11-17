// Demo flight data for testing purposes

export const demoFlight = {
  success: true,
  data: {
    "id": "OB1[TBO]rth4mRLiaUbDIiqvJabMloUadNHPsaRRwg3fYmWV6tDI0etT/lYgrDoyRzx7cl3wdH7ZEl6F1LPug1dEOEtuWGkBzEubt4pMXUS6tP+J4JrWVpdgy0sj/9a9+k5P5pVZOf8+ShcVKqFnfAbko+MzIsQRPgRelIA2g22wQ75v0ZOIxUWlWj98wySJXt6RHcoxh8naxoIQ92d6itN6eFeUPJv8zY6np/MTJQSIpsQPbsneabkYfsxyi57kg8+Yxh52wZbCLBmwZSeD5c3RoGGkmcsFejiH/2WaKbMEn9SP++UYs9HNUWuYXIPBukPhhjaD2a0XqhDTPnftPGKWXbSqovgMJpmbV1rOQgDF1WikdK7Ze0YX2EmA8zBcYUfTDiDaJisvnFhthILt4OErZy8QhGO9zN/dlRulwWnX57TEy04nKgcobPfXSQ3UHmnd/tGowuOBMI4Q1WVympBduJXC42HLFGTKKgOZ3d2fTmy8kHoi4aZD5nHx7HVbo15+sabJ7jcNJCCDbm271mj2gHQwUAlNi8A3tgFsKi2X5682od9bhYyML8VIxlW/6wK4cMVSCdqnTigLkFcba96noNr0VyW6MuRjhNNoOncDox3u4zKND83rN5TCExljbB6ZxP7SkMV5g2geXJvLWJa0I7Opw543N4fzmTMp3hyI703OQuhzvfEBKjOae0AOSsve5xgNvo6DNRioLjCTl+rW3+pBMg==",
    "airline": {
      "code": "6E",
      "name": "Indigo",
      "number": "983",
      "logo": "https://www.gstatic.com/flights/airline_logos/70px/6e.png"
    },
    "origin": "HDO",
    "originInfo": {
      "code": "HDO",
      "city": "Ghaziabad",
      "airport": "Hindon Airport",
      "terminal": ""
    },
    "destination": "BOM",
    "destinationInfo": {
      "code": "BOM",
      "city": "Mumbai",
      "airport": "Chhatrapati Shivaji Maharaj International Airport",
      "terminal": "2"
    },
    "departureTime": "2025-11-18T11:45:00",
    "arrivalTime": "2025-11-18T14:00:00",
    "duration": "2h 15m",
    "durationInMinutes": 135,
    "stops": 1,
    "aircraftType": "320",
    "fare": {
      "baseFare": 4278,
      "tax": 819,
      "totalFare": 5097,
      "currency": "INR",
      "refundable": true
    },
    "cabinClass": 2,
    "bookingClass": "Tactical",
    "fareType": "RegularFare",
    "baggage": "15 Kilograms",
    "amenities": {
      "wifi": false,
      "meals": false,
      "entertainment": false
    },
    "segments": [
      {
        "Baggage": "15 Kilograms",
        "CabinBaggage": "7 KG",
        "CabinClass": 2,
        "SupplierFareClass": "Tactical",
        "TripIndicator": 1,
        "SegmentIndicator": 1,
        "Airline": {
          "AirlineCode": "6E",
          "AirlineName": "Indigo",
          "FlightNumber": "983",
          "FareClass": "RT",
          "OperatingCarrier": ""
        },
        "NoOfSeatAvailable": 7,
        "Origin": {
          "Airport": {
            "AirportCode": "HDO",
            "AirportName": "Hindon Airport",
            "Terminal": "",
            "CityCode": "HDO",
            "CityName": "Ghaziabad",
            "CountryCode": "IN",
            "CountryName": "India"
          },
          "DepTime": "2025-11-18T11:45:00"
        },
        "Destination": {
          "Airport": {
            "AirportCode": "BOM",
            "AirportName": "Chhatrapati Shivaji Maharaj International Airport",
            "Terminal": "2",
            "CityCode": "BOM",
            "CityName": "Mumbai",
            "CountryCode": "IN",
            "CountryName": "India"
          },
          "ArrTime": "2025-11-18T14:00:00"
        },
        "Duration": 135,
        "GroundTime": 0,
        "Mile": 0,
        "StopOver": false,
        "FlightInfoIndex": "",
        "StopPoint": "",
        "StopPointArrivalTime": "0001-01-01T00:00:00",
        "StopPointDepartureTime": "0001-01-01T00:00:00",
        "Craft": "320",
        "Remark": null,
        "IsETicketEligible": true,
        "FlightStatus": "Confirmed",
        "Status": "",
        "FareClassification": {
          "Color": "rgb(252,230,201)",
          "Type": "Tactical"
        }
      }
    ],
    "rawData": {
      "flight": {
        "FareInclusions": [
          "Cabin Baggage - 07KG",
          "Check-In baggage - 15KG",
          "Cancellation fees - Applicable",
          "Reissue fees - Applicable",
          "Seat - Chargeable",
          "Meal - Chargeable"
        ],
        "AirlineCode": "6E",
        "IsLCC": true,
        "IsRefundable": true,
        "AirlineRemark": "This option is for travel from HDO. -API3.",
        "Fare": {
          "Currency": "INR",
          "BaseFare": 4278,
          "Tax": 819,
          "PublishedFare": 5097,
          "OfferedFare": 5077.71
        },
        "Segments": [
          [
            {
              "Baggage": "15 Kilograms",
              "CabinBaggage": "7 KG",
              "Airline": {
                "AirlineCode": "6E",
                "FlightNumber": "983"
              },
              "Origin": {
                "AirportCode": "HDO",
                "DepTime": "2025-11-18T11:45:00"
              },
              "Destination": {
                "AirportCode": "BOM",
                "ArrTime": "2025-11-18T14:00:00"
              },
              "Duration": 135,
              "Craft": "320",
              "FlightStatus": "Confirmed"
            }
          ]
        ]
      }
    }
  }
};

// Error response example
export const errorResponse = {
  success: false,
  error: {
    code: "API_ERROR",
    message: "Failed to fetch flight data. Please try again later.",
    details: "The server encountered an unexpected error while processing your request.",
    timestamp: new Date().toISOString()
  }
};

// Function to simulate API call with success/failure
export const fetchFlightData = (shouldSucceed = true) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      if (shouldSucceed) {
        resolve(demoFlight);
      } else {
        resolve(errorResponse);
      }
    }, 1000); // 1 second delay to simulate network
  });
};

// Example usage in a React component:
/*
import { fetchFlightData } from './demoFlightData';

// In your component:
const loadFlightData = async () => {
  try {
    const response = await fetchFlightData(); // true for success, false for error
    if (response.success) {
      // Handle successful response
      console.log('Flight data:', response.data);
    } else {
      // Handle error response
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('Exception:', error);
  }
};
*/

export default demoFlight;
