import React from 'react';
import LineChart from '../components/LineChart';
import Map from '../components/Map';
import { useParams } from 'react-router-dom';

export function CityPage() {
  const { city, state } = useParams();

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '70px 0px' }}>{city + ', '} {state}</h2>
      <div className="container" style={{ display: 'flex', padding: '20px', overflowX: 'hidden' }}>
        <div className="chart-container" style={{ flex: '1', marginRight: '2%', marginBottom: '40px' }}>
          <LineChart city={city} state={state} />
        </div>
        <div className="map-container" style={{ flex: '1', paddingTop: '90px', textAlign: 'center' }}>
          <Map city={city} state={state} />
        </div>
      </div>
    </>
  );
}

export default CityPage;