import React, {useState, useEffect} from 'react';
import LineChart from '../components/LineChart';
import Map from '../components/Map';
import { useParams } from 'react-router-dom';
import config from '../config.json';

export function CityPage() {
  const [valid, setValid] = useState(false)
  const { city, state } = useParams();

  const cityname = city.charAt(0).toUpperCase() + city.slice(1);
  const statename = state.charAt(0).toUpperCase() + state.slice(1);

  // input check
  async function validCheck() {
    try {
      const endpoint = `http://${config.server_host}:${config.server_port}/city?city=${cityname}&state=${statename}`;
      const response = await fetch(endpoint);
      const resJson = await response.json();

      if (Object.keys(resJson).length === 0) {
        setValid(false);
      } else {
        setValid(true);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    } 
  }

  useEffect(() => {
    validCheck();
  }, [cityname, statename]);


  if (!valid) {
    return (
      <>
        <h2 style={{ textAlign: 'center', margin: '50px 0px' }}>
        Invalid city or state
        </h2>
       
      </>
    );
  } else {
    return (
      <>
        <h2 style={{ textAlign: 'center', margin: '50px 0px' }}>
          {cityname + ', '} {statename}
        </h2>
        <div
          className="container" style={{display: 'flex', padding: '10px', overflowX: 'hidden',
          }}
        >
          valid
          <div className="chart-container" style={{flex: '1', marginLeft: '60px', marginRight: '10px', marginBottom: '40px',}}>
            <LineChart city={cityname} state={statename} />
          </div>
          <div className="map-container" style={{flex: '1', paddingTop: '110px', textAlign: 'center',}}>
            <Map city={cityname} state={statename} />
          </div>
        </div>
  
        {/* Media Query for Responsive Design */}
        <style>
          {`
            @media (max-width: 768px) {
              .container {
                flex-direction: column;
              }
              .chart-container {
                margin: 0 10px 20px 10px;
              }
              .map-container {
                padding-top: 20px;
              }
            }
          `}
        </style>
      </>
    );

  }



}

export default CityPage;
