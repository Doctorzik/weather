"use server";

export async function getWeather(lat: number, lon: number) {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
  
    if (!response.ok) throw new Error("Failed to fetch weather data");
  
    return response.json();
  }

  
  export async function  getWeatherLocation(location : string) {
       const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
    if (!location.trim()) throw new Error("Location input is empty.");

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) throw new Error("Failed to fetch location data");

    const res = await response.json();
    if (!res.length) throw new Error("Location not found");
 
    return { lat: res[0].lat, lon: res[0].lon };

  }