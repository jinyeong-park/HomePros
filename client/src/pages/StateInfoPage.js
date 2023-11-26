import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const StateInfoPage = () => {
  // Use the provided iframe HTML to embed the map
  const mapIframe = (
    <iframe
      src="https://www.google.com/maps/d/u/0/embed?mid=1me8KU9h6AYhUtdsOHgOFjGp3zxeTcfU&ehbc=2E312F&noprof=1"
      width="640"
      height="480"
      style={{ border: "none" }} // Add this to remove the border
      title="State Map" // Title for accessibility
    ></iframe>
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
        <Typography variant="h6">California</Typography>
        {mapIframe}
      </Box>
    </Box>
  );
};

export default StateInfoPage;
