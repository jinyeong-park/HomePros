import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import stateUrls from "../data/state_index_score_urls.json";
import { useParams } from "react-router-dom";
const _ = require("lodash");

const StateInfoPage = () => {
  // Use the provided iframe HTML to embed the map
  const { stateName } = useParams();
  const [category, setCategory] = useState("index_score");
  const categories = ["Index Score", "Rent", "Avg Home Price", "Total Crime"];

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

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <Box sx={{ width: "50%" }}>
        {/* Dropdown Menu */}
        <Select
          value={category}
          onChange={handleCategoryChange}
          sx={{ float: "right", mb: 2 }} // Float the dropdown to the right
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="h6">Cities</Typography>
        {/* Table to display each city and its info */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>City Name</TableCell>
                {/* Render a TableCell for each category */}
                {categories.map((cat) => (
                  <TableCell key={cat}>{cat}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* You will replace this with data fetched for each city */}
              {/* This is a placeholder */}
              <TableRow>
                <TableCell component="th" scope="row">
                  City Name
                </TableCell>
                <TableCell>Index Score</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Avg Home Price</TableCell>
                <TableCell>Total Crime</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
