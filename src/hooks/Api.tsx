import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;   // in Fahrenheit
  condition: string;     // human-readable condition
  image: string;         // icon filename path
  timestamp: string;     // formatted time
  city: string;          // NEW: city name
}

export const useWeather = (): WeatherData | null => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // ---------------------------------------------------------
  // Convert lat/lon → city name
  // ---------------------------------------------------------
  const reverseLookupCity = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        "Unknown Location"
      );
    } catch {
      return "Unknown Location";
    }
  };

  // ---------------------------------------------------------
  // Ask user to type a city when GPS fails
  // Also resolves to lat/lon and returns the city string
  // ---------------------------------------------------------
  const askForCity = async (): Promise<{ lat: number; lon: number; city: string }> => {
    const city = prompt("Unable to get location.\nEnter your city:") || "New York";

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
      );
      const data = await res.json();

      if (data.length === 0) {
        alert("City not found. Using New York, NY.");
        return { lat: 40.7128, lon: -74.0060, city: "New York, NY" };
      }

      const properCity =
        data[0].display_name.split(",")[0] || city;

      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        city: properCity,
      };
    } catch {
      alert("Error finding that city. Using New York, NY.");
      return { lat: 40.7128, lon: -74.0060, city: "New York, NY" };
    }
  };

  // ---------------------------------------------------------
  // Get user coordinates OR fall back to typed city
  // ---------------------------------------------------------
  const getCoords = async (): Promise<{ lat: number; lon: number; city: string }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        askForCity().then(resolve);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const city = await reverseLookupCity(lat, lon);
          resolve({ lat, lon, city });
        },
        async () => {
          resolve(await askForCity());
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  // ---------------------------------------------------------
  // Fetch weather
  // ---------------------------------------------------------
  useEffect(() => {
    const run = async () => {
      const { lat, lon, city } = await getCoords();

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        const { temperature: tempC, weathercode, time } = data.current_weather;

        const temperature = Math.round((tempC * 9) / 5 + 32);

        // your original image mapping
        const weatherMap: Record<number, { condition: string; image: string }> = {
          0: { condition: "Clear", image: "Clear Day (Sunny).png" },
          1: { condition: "Mainly Clear", image: "Mostly Cloudy Day.png" },
          2: { condition: "Partly Cloudy", image: "Partly Cloudy Day.png" },
          3: { condition: "Overcast/Rain", image: "Rain.png" },
          45: { condition: "Fog", image: "Fog, Mist.png" },
          48: { condition: "Depositing Rime Fog", image: "Fog, Mist.png" },
          51: { condition: "Drizzle Light", image: "Rain.png" },
          53: { condition: "Drizzle Moderate", image: "Rain.png" },
          55: { condition: "Drizzle Dense", image: "Rain.png" },
          61: { condition: "Rain Slight", image: "Rain.png" },
          63: { condition: "Rain Moderate", image: "Rain.png" },
          65: { condition: "Rain Heavy", image: "Rain.png" },
          71: { condition: "Snow Slight", image: "Snow.png" },
          73: { condition: "Snow Moderate", image: "Snow.png" },
          75: { condition: "Snow Heavy", image: "Snow.png" },
          80: { condition: "Rain Showers", image: "Rain.png" },
          81: { condition: "Rain Showers Moderate", image: "Rain.png" },
          82: { condition: "Rain Showers Violent", image: "Rain.png" },
          95: { condition: "Thunderstorm", image: "Thunderbolt-Lightning.png" },
          99: { condition: "Thunderstorm Hail", image: "Thunderbolt-Lightning.png" },
        };

        const { condition, image } = weatherMap[weathercode] || {
          condition: "Unknown",
          image: "Clear Day (Sunny).png",
        };

        // your original timestamp logic
        const dateObj = new Date(time);
        const formattedTime = dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
        });
        const timestamp = `As of ${formattedTime}, ${formattedDate}`;

        setWeather({
          temperature,
          condition,
          image: `/assets/icons/${image}`,
          timestamp,
          city, // ← NEW
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    run();
  }, []);

  return weather;
};

