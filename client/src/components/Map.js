import React from 'react';

const Map = ({ latitude, longitude }) => {
    const lati = parseFloat(latitude);
    const long = parseFloat(longitude);

    
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${long -2}%2C${lati -2}%2C${long + 2}%2C${lati + 2}&amp;layer=mapnik`;
 

  return (
    <>
      <iframe
        title="Map"
        width="500"
        height="350"
        src={embedUrl}
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
};

export default Map;
