import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import throttle from "lodash/throttle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
const config = require("../config.json");

const backend = `http://${config.server_host}:${config.server_port}`;
const fetchSuggestions = throttle(
  async (searchTerm, searchType, setOptions) => {
    if (searchTerm.length > 0) {
      // Adjust based on when you want to start fetching suggestions
      try {
        const response = await axios.get(`${backend}/search`, {
          params: { searchTerm: searchTerm, searchType: searchType },
        });
        setOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    }
  },
  200
);

function App() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const handleCityInputChange = (event, newInputValue, reason) => {
    if (reason === "input") {
      setCity(newInputValue);
      fetchSuggestions(newInputValue, "city", setCityOptions);
    }
    if (reason === "clear") {
      setCity(""); // Reset city
      setState(""); // Reset state
    }
  };
  // This function will be triggered when a suggestion is selected
  const handleCitySelect = (event, value, reason) => {
    if (reason === "selectOption" && value) {
      console.log(value);
      setCity(value.city);
      setState(value.state);
      // setCityInputValue(value.city);
    }
  };

  const handleStateInputChange = (event, newInputValue, reason) => {
    if (reason === "input") {
      setState(newInputValue);
      fetchSuggestions(newInputValue, "state", setStateOptions);
    }
    if (reason === "clear") {
      setState(""); // Reset state
    }
  };

  // This function will be triggered when a suggestion is selected
  const handleStateSelect = (event, value, reason) => {
    if (reason === "selectOption" && value) {
      setState(value.state);
    }
  };

  const handleSubmit = async () => {
    // Check if city is filled, then state must also be filled
    if (!state) {
      alert("State is required");
      return;
    }

    // Data object to send to the backend
    const dataToSend = {
      city: city || null,
      state: state, // Send null if state is not filled
    };

    try {
      let response;
      if (city !== null) {
        response = await axios.get(`${backend}/city`, { params: dataToSend });
      } else {
        response = await axios.get(`${backend}/state`, { params: dataToSend });
      }
      // Handle response
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Find your dream city
      </Typography>

      <Box sx={{ width: "100%", maxWidth: "500px", my: 2 }}>
        <Autocomplete
          freeSolo
          inputValue={city}
          onInputChange={handleCityInputChange}
          getOptionLabel={(option) =>
            option.city ? `${option.city}, ${option.state}` : ""
          }
          onChange={handleCitySelect}
          options={cityOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={city}
            />
          )}
        />
        <Autocomplete
          freeSolo
          inputValue={state}
          onInputChange={handleStateInputChange}
          getOptionLabel={(option) => option.state || ""}
          onChange={handleStateSelect}
          options={stateOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={state}
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: "80%",
            height: "56px",
            mt: 3,
            mb: 2,
            display: "block",
            mx: "auto",
          }}
          onClick={handleSubmit}
        >
          Search
        </Button>
      </Box>
    </Container>
  );
}

export default App;
