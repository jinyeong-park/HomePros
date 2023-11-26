import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import stateUrls from "../data/state_index_score_urls.json";
import { useParams } from "react-router-dom";
const _ = require("lodash");

const StateInfoPage = () => {
  // Use the provided iframe HTML to embed the map
  const { stateName } = useParams();

  console.log(stateName);
  const mapIframe =
    stateName && stateUrls[stateName] ? (
      <iframe
        src={stateUrls[stateName].index_score}
        width="640"
        height="480"
        style={{ border: "none" }}
        title={`${stateName} State Map`}
      ></iframe>
    ) : (
      <p>Map is not available</p>
    );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <Box sx={{ width: "50%" }}>
        {/* List of cities and their index scores */}
        <Typography variant="h6">Cities</Typography>
        {/* You can map over your cities data to display each city and its info */}
        {/* This is a placeholder, replace with your actual data rendering logic */}
        <Box>
          <Typography variant="body1">City Name</Typography>
          <Typography variant="body1">Index Score</Typography>
          <Typography variant="body1">Rent</Typography>
          <Typography variant="body1">Avg Home Price</Typography>
          <Typography variant="body1">Total Crime</Typography>
        </Box>
      </Box>

      <Box sx={{ width: "50%" }}>
        {/* Static state map */}
        <Typography variant="h6">{stateName}</Typography>
        {mapIframe}
      </Box>
    </Box>
  );
};

export default StateInfoPage;
