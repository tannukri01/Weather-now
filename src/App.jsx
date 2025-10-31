import React, { useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  
  const getWeather = async () => {
    if (!city.trim()) return;

    try {
      setError("");
      setWeather(null);

      
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

     
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        ...weatherData,
        name,
        country,
        latitude,
        longitude,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data");
    }
  };

  
  function getWeatherVideo() {
  if (!weather) return "/videos/cloud.mp4";
  const code = weather.current_weather.weathercode;
  console.log("Weather code:", code);
  if (code === 0) return "/videos/cloud.mp4"; 
  if ([1, 2, 3].includes(code)) return "/videos/cloud.mp4"; 
  if ([45, 48].includes(code)) return "/videos/snow.mp4"; 
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return "/videos/rainy.mp4"; 
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "/videos/snow.mp4"; 
  return "/videos/cloud.mp4";
}


  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white text-center">
      {/* 🎥 Background Video */}
      <video
        key={getWeatherVideo()}
        className="absolute w-full h-full object-cover -z-10"
        src={getWeatherVideo()}
        autoPlay
        loop
        muted
      />

      <div className="bg-black/60 p-6 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-4">🌤️ Real Weather</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 px-3 py-2 rounded text-black"
          />
          <button
            onClick={getWeather}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Get Weather
          </button>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        {weather && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {weather.name}, {weather.country}
            </h2>
            <p>🌡️ Temp: {weather.current_weather.temperature}°C</p>
            <p>💨 Wind: {weather.current_weather.windspeed} km/h</p>
            <p>
              📍 Lat: {weather.latitude} | Lon: {weather.longitude}
            </p>
            <p>🕒 Updated: {weather.current_weather.time}</p>
          </div>
        )}
      </div>
    </div>
  );
}
