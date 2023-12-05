import React, { useState, useEffect } from 'react';
import config from '../config.json';

const Map = ({ city, state }) => {
  const [locationData, setLocationData] = useState({ longitude: 0, latitude: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);

      try {
        const endpoint = `http://${config.server_host}:${config.server_port}/city?city=${city}&state=${state}`;
        const response = await fetch(endpoint);
        const resJson = await response.json();

        if (resJson.length > 0) {
          setLocationData({
            longitude: resJson[0].longitude,
            latitude: resJson[0].latitude,
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [city, state]);

  const MapFrame = () => {
    const { longitude, latitude } = locationData;

    if (longitude !== 0 && latitude !== 0) {
      const lati = parseFloat(latitude);
      const long = parseFloat(longitude);

      return (
        <>
          <iframe
            title="Map"
            width="800"
            height="350"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${long - 2}%2C${lati - 2}%2C${long + 2}%2C${lati + 2}&layer=mapnik&marker=${lati}%2C${long}`}
            style={{ border: '1px solid black' }}
          ></iframe>
          <br />
          <small>
            <a href={`https://www.openstreetmap.org/#map=8/${latitude}/${longitude}`}>
              View Larger Map
            </a>
          </small>
        </>
      );
    }

    return <p>No location data available</p>;
  };

  return <>{loading ? <p>Loading map...</p> : <MapFrame />}</>;
};

export default Map;

