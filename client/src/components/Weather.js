import React, { useState, useEffect } from 'react';

const Weather = ({latitude, longitude}) => {
  const [currentTemp, setCurrentTemp] = useState('');

  useEffect(() => {
    // Function to fetch data from the first API
    const fetchData1 = async () => {
      try {
        const response = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
        const jsonData = await response.json();
        console.log("api 1",latitude, jsonData);
        // If the first fetch is successful, initiate the second fetch
        fetchData2(jsonData.properties.forecastHourly); // Pass relevant data from data1 to fetchData2 if needed
      } catch (error) {
        console.error('Error fetching data from API1:', error);
      }
    };

    // Function to fetch data from the second API
    const fetchData2 = async (forecastUrl) => {
      try {
        // Use the relevant data from data1 to construct the URL or request for the second API
        const response = await fetch(forecastUrl);
        const jsonData = await response.json();
        console.log(latitude, longitude, jsonData);
        if (jsonData['properties']['periods']['0']['temperature']){
        setCurrentTemp(`${jsonData['properties']['periods']['0']['temperature']}\u00B0F`);
        }else{
            setCurrentTemp("Data not available")
        }
      } catch (error) {
        setCurrentTemp("Data not available")
        console.error('Error fetching data from API2:', error);
      }
    };

    // Call the first fetch function when the component mounts
    fetchData1();
     // Set up interval to fetch weather data every hour (3600000 milliseconds)
    const intervalId = setInterval(() => {
      fetchData1();
    }, 1200000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [latitude, longitude]); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      <pre>{`Current Temp: ${currentTemp}`}</pre>
    </div>
  );
};

export default Weather;
