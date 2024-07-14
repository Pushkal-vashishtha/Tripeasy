
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = 'AIzaSyCnq0PB0XJHLvxEDWImR5BUkokNQ2JrB3A';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

    export const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
            role: "user",
            parts: [
              {text: "Generate Travel Plan for Location: Ladakh, India, for 4 Days and 3 Night for A Couple with a Moderate budget with a Flight details, Flight Price with Booking url, Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and Places to visit nearby with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for 4 days and 3 night with each day plan with best time to visit in JSON format\n"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "```json\n{\n  \"trip_details\": {\n    \"destination\": \"Ladakh, India\",\n    \"duration\": \"4 Days 3 Nights\",\n    \"travelers\": \"Couple\",\n    \"budget\": \"Moderate\",\n    \"best_time_to_visit\": \"June to September (Summer)\"\n  },\n  \"flights\": {\n    \"details\": [\n      {\n        \"airline\": \"IndiGo\",\n        \"flight_number\": \"6E-612\",\n        \"departure_city\": \"Delhi\",\n        \"arrival_city\": \"Leh\",\n        \"departure_date\": \"2024-07-15\",\n        \"arrival_date\": \"2024-07-15\",\n        \"departure_time\": \"08:00 AM\",\n        \"arrival_time\": \"10:00 AM\",\n        \"price\": \"₹8,000 (approx.)\",\n        \"booking_url\": \"https://www.goindigo.in/\" \n      },\n      {\n        \"airline\": \"SpiceJet\",\n        \"flight_number\": \"SG-2985\",\n        \"departure_city\": \"Delhi\",\n        \"arrival_city\": \"Leh\",\n        \"departure_date\": \"2024-07-15\",\n        \"arrival_date\": \"2024-07-15\",\n        \"departure_time\": \"09:30 AM\",\n        \"arrival_time\": \"11:30 AM\",\n        \"price\": \"₹9,500 (approx.)\",\n        \"booking_url\": \"https://www.spicejet.com/\" \n      }\n    ]\n  },\n  \"hotels\": {\n    \"options\": [\n      {\n        \"hotel_name\": \"The Grand Dragon Ladakh\",\n        \"hotel_address\": \"Changspa Road, Leh, Ladakh 194101\",\n        \"price\": \"₹3,500 - ₹5,000 per night\",\n        \"hotel_image_url\": \"https://images.thrillophilia.com/image/upload/s--w2jP4k7g--/c_fill,f_auto,fl_progressive,g_center,h_600,q_auto,w_900/v1/images/photos/000/029/009/original/the_grand_dragon_ladakh_leh_ladakh_india.jpg\",\n        \"geo_coordinates\": \"34.1534° N, 77.5817° E\",\n        \"rating\": 4.2,\n        \"description\": \"A well-maintained hotel with comfortable rooms, a multi-cuisine restaurant, and a rooftop cafe offering stunning views.\"\n      },\n      {\n        \"hotel_name\": \"The Ladakh Hotel\",\n        \"hotel_address\": \"Changspa Road, Leh, Ladakh 194101\",\n        \"price\": \"₹2,800 - ₹4,000 per night\",\n        \"hotel_image_url\": \"https://www.theladakhhotel.com/images/gallery/Hotel%20Exterior.jpg\",\n        \"geo_coordinates\": \"34.1530° N, 77.5821° E\",\n        \"rating\": 4.0,\n        \"description\": \"A budget-friendly option with clean and cozy rooms, a rooftop dining area, and a friendly staff.\"\n      },\n      {\n        \"hotel_name\": \"Hotel Tibet\",\n        \"hotel_address\": \"Changspa Road, Leh, Ladakh 194101\",\n        \"price\": \"₹2,000 - ₹3,500 per night\",\n        \"hotel_image_url\": \"https://www.hoteltibet.in/images/gallery/room-1.jpg\",\n        \"geo_coordinates\": \"34.1527° N, 77.5825° E\",\n        \"rating\": 3.8,\n        \"description\": \"A simple yet comfortable hotel with basic amenities, a restaurant serving local cuisine, and a central location.\"\n      }\n    ]\n  },\n  \"itinerary\": {\n    \"day1\": {\n      \"time\": \"Morning (8:00 AM - 12:00 PM)\",\n      \"activity\": \"Arrive at Leh Airport, transfer to your hotel (The Grand Dragon Ladakh - recommended), acclimatize, and relax.\",\n      \"places_to_visit\": []\n    },\n    \"day2\": {\n      \"time\": \"Morning (9:00 AM - 1:00 PM)\",\n      \"activity\": \"Visit Shanti Stupa (A Buddhist shrine offering panoramic views of Leh)\",\n      \"places_to_visit\": [\n        {\n          \"place_name\": \"Shanti Stupa\",\n          \"place_details\": \"A white-domed stupa built by Japanese Buddhists, offering stunning views of the Leh Valley.\",\n          \"place_image_url\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Shanti_Stupa_Leh%2C_Ladakh%2C_India.jpg/1280px-Shanti_Stupa_Leh%2C_Ladakh%2C_India.jpg\",\n          \"geo_coordinates\": \"34.1632° N, 77.5769° E\",\n          \"ticket_pricing\": \"Free\",\n          \"time_to_travel\": \"1-2 hours\"\n        }\n      ]\n    },\n    \"day3\": {\n      \"time\": \"Morning (9:00 AM - 1:00 PM)\",\n      \"activity\": \"Visit Leh Palace (An ancient royal palace offering stunning views of Leh)\",\n      \"places_to_visit\": [\n        {\n          \"place_name\": \"Leh Palace\",\n          \"place_details\": \"A historic palace built by King Sengge Namgyal, offering breathtaking views of Leh city and the surrounding mountains.\",\n          \"place_image_url\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Leh_Palace_%28cropped%29.jpg/1280px-Leh_Palace_%28cropped%29.jpg\",\n          \"geo_coordinates\": \"34.1626° N, 77.5779° E\",\n          \"ticket_pricing\": \"₹50 per person\",\n          \"time_to_travel\": \"2-3 hours\"\n        }\n      ]\n    },\n    \"day4\": {\n      \"time\": \"Morning (9:00 AM - 1:00 PM)\",\n      \"activity\": \"Visit Magnetic Hill (An optical illusion that makes vehicles appear to roll uphill)\",\n      \"places_to_visit\": [\n        {\n          \"place_name\": \"Magnetic Hill\",\n          \"place_details\": \"A popular tourist spot known for its optical illusion that makes vehicles appear to roll uphill.\",\n          \"place_image_url\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Ladakh_Magnetic_Hill.jpg/1280px-Ladakh_Magnetic_Hill.jpg\",\n          \"geo_coordinates\": \"34.1879° N, 77.5734° E\",\n          \"ticket_pricing\": \"Free\",\n          \"time_to_travel\": \"1-2 hours\"\n        }\n      ]\n    }\n  }\n}\n```\n\n**Notes:**\n\n* This is just a sample itinerary and can be customized based on your interests and preferences.\n* The flight prices are approximate and can vary based on the booking time, availability, and other factors.\n* The hotel prices are also approximate and can vary based on the season, room type, and availability.\n* It is recommended to book your flights and hotels in advance, especially during peak season.\n* Make sure to acclimatize properly to the high altitude of Leh to avoid altitude sickness.\n* Pack warm clothing as the weather in Ladakh can be unpredictable.\n* Carry necessary medications and essentials.\n* Be respectful of the local culture and traditions.\n* Have fun and enjoy your trip!\n"},
            ],
          },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
  