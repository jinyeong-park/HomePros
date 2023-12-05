const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

// city rankings routes
app.get("/top_cities", routes.top_cities);
app.get("/salesrank_cities", routes.salesrank_cities);
app.get("/safest_cities", routes.safest_cities);
app.get("/rentrank_cities", routes.rentrank_cities);
app.get("/taxrank_cities", routes.taxrank_cities);
app.get("/namerank_cities", routes.namerank_cities);
app.get("/homesold_cities", routes.homesold_cities);

// state rankings routes
app.get("/top_states", routes.top_states);
app.get("/taxrank_states", routes.taxrank_states);
app.get("/safest_states", routes.safest_states);
app.get("/namerank_states", routes.namerank_states);
app.get("/homesold_states", routes.homesold_states);

// city and state info routes
app.get("/city", routes.city);
app.get("/monthly_house_prices", routes.monthly_house_prices);
app.get("/monthly_rent_prices", routes.monthly_rent_prices);
app.get("/yearly_crime", routes.yearly_crime);
app.get("/state", routes.state);

// advanced city search routes
app.get("/search_cities", routes.search_cities);
app.get("/search", routes.search);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
