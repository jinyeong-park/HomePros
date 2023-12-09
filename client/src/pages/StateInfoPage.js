import React, { useEffect, useState } from "react";
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
import TablePagination from "@mui/material/TablePagination";
import stateUrls from "../data/state_index_score_urls.json";
import { Link, Link as RouterLink, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { Grid, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
const config = require("../config.json");

const backend = `http://${config.server_host}:${config.server_port}`;

const StateInfoPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Use the provided iframe HTML to embed the map
  const { state } = useParams();
  const stateName = state.toString().toLocaleLowerCase();
  const [category, setCategory] = useState("Index Score");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const [rows, setRows] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const paginationCount = hasMoreData ? -1 : page * rowsPerPage;

  const categories = ["Index Score", "Rent", "Avg Home Price", "Total Crime"];
  const categoryMap = {
    "Index Score": "index_score",
    Rent: "avg_rental_price",
    "Avg Home Price": "avg_sales_price",
    "Total Crime": "crime_rate",
  };
  // const rowsPerPageOptions = [10];
  const mapIframe =
    stateName && stateUrls[stateName] ? (
      <iframe
        src={stateUrls[stateName].index_score}
        width="100%"
        height="90%"
        style={{ minHeight: "450px", border: "none" }}
        title={`${
          stateName.charAt(0).toUpperCase() + stateName.slice(1)
        } State Map`}
      ></iframe>
    ) : (
      <p>Map is not available</p>
    );

  const note =
    "Index Score is calculated based on several socio-economic criteria to rank the cities";

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Define a function to generate the URL for city details
  const generateCityUrl = (cityName) => {
    const citySlug = encodeURIComponent(
      cityName.replace(/\s+/g, "-").toLowerCase()
    );
    const stateSlug = encodeURIComponent(
      stateName.replace(/\s+/g, "-").toLowerCase()
    );
    return `/city/${citySlug}/${stateSlug}`;
  };

  useEffect(() => {
    const fetchDataForCategory = async (selectedCategory, page = 0) => {
      const categoryEndpointMap = {
        "Index Score": "/top_cities",
        Rent: "/rentrank_cities",
        "Avg Home Price": "/salesrank_cities",
        "Total Crime": "/safest_cities",
      };

      const endpoint = categoryEndpointMap[selectedCategory];
      try {
        const response = await fetch(
          backend +
            endpoint +
            `?state=${stateName}&page=${page + 1}&page_size=${rowsPerPage}`
        );
        const data = await response.json();
        // console.log(data);
        const data_arr = Object.values(data);
        if (data_arr.length === 0) {
          setHasMoreData(false);
        } else {
          setHasMoreData(true);
        }
        setRows(data_arr);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle errors or set error state here
      }
    };
    // Fetch data for the default category on component mount
    fetchDataForCategory(category, page);
  }, [category, stateName, page]);

  const handleChangePage = async (event, newPage) => {
    // const updatePage = hasMoreData ? newPage : page;
    setPage(newPage);
    // await fetchDataForCategory(category, newPage);
  };
  // Custom Pagination Actions Component

  return (
    <Box sx={{ p: 4, width: "100%", mx: "auto" }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: 3,
          fontFamily: "Roboto",
        }}
      >
        {stateName.charAt(0).toUpperCase() + stateName.slice(1)}
      </Typography>

      <Grid
        container
        spacing={8}
        direction={isSmallScreen ? "column-reverse" : "row"}
        sx={{
          minWidth: "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!hasMoreData && page === 0 ? (
          // Display a styled message when data is empty
          <Grid
            sx={{
              minWidth: 450,
            }}
          >
            <CloudOffIcon style={{ fontSize: 60, color: "lightgray" }} />
            <Typography variant="subtitle1" color="textSecondary">
              No Data Available
            </Typography>
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              minWidth: 450,
            }}
          >
            <>
              <Select
                value={category}
                onChange={handleCategoryChange}
                sx={{ float: "right", mb: 2 }} // Position the dropdown to the right
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              <TableContainer component={Paper}>
                <Table
                  sx={{ float: "left", minWidth: 450 }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        City Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {category}
                        {category === "Index Score" && (
                          <sup>
                            <Tooltip title={note}>
                              <IconButton>
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </sup>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows &&
                      rows
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.city}>
                            <TableCell component="th" scope="row">
                              <Link
                                component={RouterLink}
                                to={generateCityUrl(row.city)}
                              >
                                {row.city}
                              </Link>
                            </TableCell>
                            <TableCell>{row[categoryMap[category]]}</TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                sx={{
                  "& .MuiTablePagination-displayedRows": { display: "none" },
                }}
                rowsPerPageOptions={[]}
                component="div"
                count={paginationCount} // Use totalRows for the count
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
              />
            </>
          </Grid>
        )}
        <Grid
          item
          xs={12}
          md={6}
          style={{
            width: isSmallScreen ? "100%" : "60%",
            minHeight: "450px",
          }}
        >
          {mapIframe}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StateInfoPage;
