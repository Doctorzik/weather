"use client";
import date from 'date-and-time';
import { getWeather, getWeatherLocation } from "./actions/weather";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { InputWithButton } from "@/components/ui/molecules/search";
import { useQuery } from "@tanstack/react-query";


export default function Home() {
  const [location, setLocation] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  const { data: coordinates } = useQuery<{ lat: number; lon: number }, Error>({
    queryKey: ["location", location],
    queryFn: () => getWeatherLocation(location!),
    enabled: !!location,
  });

  useEffect(() => {
    if (coordinates) {
      setUserCoords(coordinates);
    }
  }, [coordinates]);


  // Recursive Geolocation Fetch
  const getUserLocation = (attempts: number = 3) => {
    if (attempts <= 0) {
      console.log("Max geolocation attempts reached. Please enter a location manually.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      () => {
        console.warn(`Retrying geolocation... Attempts left: ${attempts - 1}`);
        getUserLocation(attempts - 1);
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Query to get Weather (Uses `getWeather` Server Action)
  const { data: weather, error, isFetching } = useQuery({
    queryKey: ["weather", userCoords?.lat, userCoords?.lon], // ✅ Ensure queryKey has separate lat & lon
    queryFn: () => (userCoords ? getWeather(userCoords.lat, userCoords.lon) : Promise.resolve(null)),
    enabled: !!userCoords, // Runs only when userCoords exist
  });

  const now = new Date(weather?.dt * 1000)
  const me = date.format(now, 'HH:mm:ss')
  return (
    <main>
      <Card>
        <CardHeader className="text-center text-[100px] text-white">
          <CardTitle>Weather App</CardTitle>
          <CardDescription>Check Weather with Ease</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-[460px]  bg-[#000000]/80 mx-auto m-[10px]">
            <InputWithButton handleLocation={setLocation} className=" m-[10px] mx-auto" />

            <div className="bg-red-700 p-4 text-white text-center">
              {isFetching ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error.message}</p>
              ) : weather ? (
                <>

                  <h3 className="text-xl font-bold">Name: {weather.name}</h3>
                  <p>Temperature: {weather.main.temp}°C</p>
                  {/* {format(weather?.dt, 'hh:mm:ss A')} */}
                  <p>Time: {me} </p>
                  <p>Condition: {weather.weather[0].description}</p>
                </>
              ) : (
                "No weather data available"
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter></CardFooter>``
      </Card>
    </main>
  );
}
