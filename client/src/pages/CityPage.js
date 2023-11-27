import React, {useState} from 'react'
import LineChart from '../components/LineChart'
import Map from '../components/Map'



export function CityPage({city, state}) {

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>{city+", "} {state}</h2>
      <div className="container">
        <div className="chart-container" style={{ width: '90%', margin: '0 auto', marginBottom: '40px' }}>
          <LineChart city={city} state={state} />
        </div>
        <div className="map-container" style={{ minWidth: '500px', textAlign:'center'}}>
          <Map latitude='40.6943' longitude='-74.699' />
        </div>
      </div>
    </>
  );

}


export default CityPage