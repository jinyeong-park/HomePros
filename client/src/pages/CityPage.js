import React from "react";
import LineChart from "../components/LineChart";
import Map from "../components/Map";
import { useParams } from "react-router-dom";

export function CityPage() {
  const { city, state } = useParams();
  const cityname = city.charAt(0).toUpperCase() + city.slice(1);
  const statename = state.charAt(0).toUpperCase() + state.slice(1);

  return (
    <>
      <h2 style={{ textAlign: "center", margin: "70px 0px" }}>
        {cityname + ", "} {statename}
      </h2>
      <div
        className="container"
        style={{ display: "flex", padding: "20px", overflowX: "hidden" }}
      >
        <div
          className="chart-container"
          style={{ flex: "1", marginRight: "2%", marginBottom: "40px" }}
        >
          <LineChart city={cityname} state={statename} />
        </div>
        <div
          className="map-container"
          style={{ flex: "1", paddingTop: "90px", textAlign: "center" }}
        >
          <Map city={cityname} state={statename} />
        </div>
      </div>
    </>
  );
}

export default CityPage;
