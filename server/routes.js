const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

/********************************
 * City Rankings Routes *
 ********************************/

// City ranking ways include ranking by index score, home sales price, crime rate, rental price, tax burden, and alphabetically

// Route 1: GET /top_cities
// Returns top cities ranking by our calculated index score, based on multiple areas with housing price, rent price, crime,
// population, and tax combined.
// Default to show city rankings across all states, and can input state/city to limit only ranking in one state/city.
const top_cities = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // If no city input, then default to include all cities. If there is input, then show the input city
  const city = req.query.city ?? "";

  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH CityState AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE state LIKE '${state}%'
    AND city LIKE '${city}%'
    )
    
    SELECT c.city, c.county, c.state, i.index_score
    FROM CityState c
    JOIN CityIndexScore i
    ON c.city_id = i.city_id
    ORDER BY index_score
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 2: GET /salesrank_cities
// Returns cities ranked by 2022 average home sales price, from cheapest to most expensive.
// Default to show city rankings across all states, and can input state/city to limit only ranking in one state/city.
const salesrank_cities = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // If no city input, then default to include all cities. If there is input, then show the input city
  const city = req.query.city ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH HomeSales2022 AS
    (
    SELECT city_id, avg_sales_price
    FROM HomeSummary2022
    WHERE avg_sales_price >= 0
    )
    
    , CityState AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE state LIKE '${state}%'
    AND city LIKE '${city}%'
    )
    
    SELECT c.city, c.county, c.state, h.avg_sales_price
    FROM CityState c
    JOIN HomeSales2022 h
    ON c.city_id = h.city_id
    ORDER BY h.avg_sales_price
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 3: GET /safest_cities
// Returns safest cities to live in from lowest crime rate to highest crime rate.
// Default to show city rankings across all states, and can input state/city to limit only ranking in one state/city.
const safest_cities = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // If no city input, then default to include all cities. If there is input, then show the input city
  const city = req.query.city ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH Crime2019 AS
    (
    SELECT city_id, (violent_crime + property_crime) AS total_crimes
    FROM Crime
    WHERE year = 2019 AND violent_crime >= 0 AND property_crime >= 0
    )
    
    , CityState AS
    (
    SELECT city_id, city, county, state, population
    FROM City
    WHERE state LIKE '${state}%'
    AND city LIKE '${city}%'
    AND population >= 1
    )
    
    SELECT c.city, c.county, c.state, cri.total_crimes / c.population * 100000 AS crime_rate
    FROM CityState c
    JOIN Crime2019 cri
    ON c.city_id = cri.city_id
    ORDER BY crime_rate
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 4: GET /rentrank_cities
// Returns cities ranked by 2022 average rental price, from cheapest to most expensive.
// Default to show city rankings across all states, and can input state/city to limit only ranking in one state/city.
const rentrank_cities = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // If no city input, then default to include all cities. If there is input, then show the input city
  const city = req.query.city ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH Rent2022 AS
    (
    SELECT city_id, avg_rental_price
    FROM RentSummary2022
    WHERE avg_rental_price >= 0
    )

    , CityState AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE state LIKE '${state}%'
    AND city LIKE '${city}%'
    )

    SELECT c.city, c.county, c.state, r.avg_rental_price
    FROM CityState c
    JOIN Rent2022 r
    ON c.city_id = r.city_id
    ORDER BY r.avg_rental_price
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 5: GET /taxrank_cities
// Returns cities ranked by state local tax burden, from lowest tax to highest.
// Default to show city rankings across all states, and can input state/city to limit only ranking in one state/city.
const taxrank_cities = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // If no city input, then default to include all cities. If there is input, then show the input city
  const city = req.query.city ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH TaxBurden AS
    (
    SELECT state, state_local_tax_burden AS tax_burden
    FROM Tax
    WHERE state_local_tax_burden >= 0
    )

    , CityState AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE state LIKE '${state}%'
    AND city LIKE '${city}%'
    )

    SELECT c.city, c.county, c.state, t.tax_burden
    FROM TaxBurden t
    JOIN CityState c
    ON t.state = c.state
    ORDER BY t.tax_burden
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 6: GET /namerank_cities
// Returns cities ranked by name alphabetically, from A to Z
// Default to show city rankings across all states, and can input state/city to limit only ranking in one state/city.
const namerank_cities = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // If no city input, then default to include all cities. If there is input, then show the input city
  const city = req.query.city ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `SELECT city, county, state
    FROM City
    WHERE state LIKE '${state}%'
    AND city LIKE '${city}%'
    ORDER BY city, county, state    
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 7: GET /homesold_cities
// Returns information on the most popular housing city market by how many houses were sold in the last year, from highest to lowest
// Default to show city rankings across all states, and can input state/city to limit only ranking in one state/city.
const homesold_cities = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // If no city input, then default to include all cities. If there is input, then show the input city
  const city = req.query.city ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH HomeSalesCount AS
    (
    SELECT city_id, homes_sold
    FROM HomeSummary2022
    WHERE homes_sold >= 0
    )

    , CityState AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE state LIKE '${state}%'
    AND city LIKE '${city}%'
    )
    
    SELECT c.city, c.county, c.state, h.homes_sold
    FROM CityState c
    JOIN HomeSalesCount h
    ON c.city_id = h.city_id
    ORDER BY h.homes_sold DESC
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

/********************************
 * State Rankings Routes *
 ********************************/

// State ranking ways include ranking by index score, total crimes, tax burden, and alphabetically

// Route 8: GET /top_states
// Returns top states ranking by our calculated index score, based on crime and tax burden combined.
// Note: No state filter with index score calculation
const top_states = async function (req, res) {
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH Crime2019 AS
    (
    SELECT city_id, (violent_crime + property_crime) AS total_crimes
    FROM Crime
    WHERE year = 2019
    AND violent_crime >= 0 AND property_crime >= 0
    )
    
    , TaxBurden AS
    (
    SELECT state, state_local_tax_burden AS tax_burden
    FROM Tax
    WHERE state_local_tax_burden >= 0
    )
    
    , CityState AS
    (SELECT city_id, state
    FROM City
    )
    
    SELECT c.state, t.tax_burden, SUM(cri.total_crimes) AS total_crimes,
           (0.5 * ((SUM(cri.total_crimes) - AVG(SUM(cri.total_crimes)) OVER ()) / STDDEV(SUM(cri.total_crimes)) OVER ())) +
           (0.5 * ((SUM(t.tax_burden) - AVG(SUM(t.tax_burden)) OVER ()) /
                   STDDEV(SUM(t.tax_burden)) OVER ())) AS index_score
    FROM TaxBurden t
    JOIN CityState c
    ON t.state = c.state
    JOIN Crime2019 cri
    ON c.city_id = cri.city_id
    GROUP BY t.state, t.tax_burden
    ORDER BY index_score
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 9: GET /taxrank_states
// Returns top states ranking by state local state burden, from lowest to highest
// Default to show rankings across all states, and can input state to limit only ranking in one state.
const taxrank_states = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the input state
  const state = req.query.state ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `SELECT state, state_local_tax_burden AS tax_burden
    FROM Tax
    WHERE state LIKE '${state}%'
    ORDER BY state_local_tax_burden
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 10: GET /safest_states
// Returns top states ranking by total crimes, from lowest to highest
// Default to show rankings across all states, and can input state to limit only ranking in one state.
const safest_states = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the input state
  const state = req.query.state ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH Crime2019 AS
    (
    SELECT city_id, (violent_crime + property_crime) AS total_crimes
    FROM Crime
    WHERE year = 2019
    AND violent_crime >= 0 AND property_crime >= 0
    )
        
    , CityState AS
    (SELECT city_id, state
    FROM City
    WHERE state LIKE '${state}%'
    )
        
    SELECT c.state, SUM(cri.total_crimes) AS total_crimes
    FROM CityState c
    JOIN Crime2019 cri
    ON c.city_id = cri.city_id
    GROUP BY c.state
    ORDER BY total_crimes
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 11: GET /namerank_states
// Returns states ranked by name alphabetically, from A to Z
// Default to show rankings across all states, and can input state to limit only ranking in one state.
const namerank_states = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `SELECT state
    FROM Tax
    WHERE state LIKE '${state}%'
    ORDER BY state
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 12: GET /homesold_states
// Returns information on the most popular housing state market by how many houses were sold in the last year, from highest to lowest
// Default to show rankings across all states, and can input state to limit only ranking in one state.
const homesold_states = async function (req, res) {
  // If no state input, then default to include all states. If there is input, then show the top cities in the input state
  const state = req.query.state ?? "";
  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  connection.query(
    `WITH HomeSalesCount AS
    (
    SELECT city_id, homes_sold
    FROM HomeSummary2022
    WHERE homes_sold >= 0
    )
    , CityState AS
    (
    SELECT city_id, state
    FROM City
    WHERE state LIKE '${state}%'
    )
    
    SELECT c.state, SUM(h.homes_sold) AS state_homes_sold
    FROM CityState c
    JOIN HomeSalesCount h
    ON c.city_id = h.city_id
    GROUP BY c.state
    ORDER BY state_homes_sold DESC
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

/********************************
 * City Info Routes *
 ********************************/

// City specific info include city basics, city monthly home sales price trend, monthly rental price trend, and yearly crime trend

// Route 13: GET /city?city=VALUE&state=VALUE
// Returns basic city information for a specific city, state inputted by a user. If the city has location info,
// also return latitude and longitude. If no location information, then return null latitude and longitude.

const city = async function (req, res) {
  const city = req.query.city;
  const state = req.query.state;

  if (!city || !state) {
    return res.status(400).send("City and state are required");
  }
  connection.query(
    `WITH CityState AS
    (SELECT city_id, city, county, state, population
    FROM City
    WHERE city = '${city}' AND state = '${state}'
    )
    
    SELECT c.city_id, c.city, c.county, c.state, c.population, l.latitude, l.longitude
    FROM CityState c
    LEFT JOIN Location l
    ON c.city_id = l.city_id`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 14: GET /monthly_house_prices?city=VALUE&state=VALUE
// Returns housing prices trends by month from a specific city from all available data.
const monthly_house_prices = async function (req, res) {
  const city = req.query.city;
  const state = req.query.state;
  console.log(state);
  if (!city || !state) {
    return res.status(400).send("City and state are required");
  }
  connection.query(
    `WITH CityName AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE city = '${city}' AND state = '${state}'
    )
    
    SELECT c.city, c.county, c.state, h.month, h.year, h.median_sale_price, h.median_list_price, h.property_type
    FROM CityName c
    JOIN HomeSales h
    ON c.city_id = h.city_id
    ORDER BY h.year, h.month
    `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 15: GET /monthly_rent_prices?city=VALUE&state=VALUE
// Returns rent prices trends by month from a specific city from all available data.
const monthly_rent_prices = async function (req, res) {
  const city = req.query.city;
  const state = req.query.state;
  console.log(state);
  if (!city || !state) {
    return res.status(400).send("City and state are required");
  }
  connection.query(
    `WITH CityName AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE city = '${city}' AND state = '${state}'
    )
    
    SELECT c.city, c.county, c.state, r.month, r.year, r.rental_price
    FROM CityName c
    JOIN Rent r
    ON c.city_id = r.city_id
    ORDER BY r.year, r.month`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 16: GET /yearly_crime?city=VALUE&state=VALUE
// Returns total crime numbers by month from a specific city from all available data.
const yearly_crime = async function (req, res) {
  const city = req.query.city;
  const state = req.query.state;
  console.log(state);
  if (!city || !state) {
    return res.status(400).send("City and state are required");
  }
  connection.query(
    `WITH CityName AS
    (
    SELECT city_id, city, county, state
    FROM City
    WHERE city = '${city}' AND state = '${state}'
    )
    
    SELECT c.city, c.county, c.state, cri.year, (cri.violent_crime + cri.property_crime) AS total_crimes
    FROM CityName c
    JOIN Crime cri
    ON c.city_id = cri.city_id
    ORDER BY cri.year`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

/********************************
 * State Info Routes *
 ********************************/

// State specific info of state names and taxes. All city ranking related state info can be found in City Rankings Routes 1-7.

// Route 17: GET /state?state=VALUE
// Returns basic tax information for a specific state inputted by a user.
const state = async function (req, res) {
  const state = req.query.state;
  console.log(state);
  if (!state) {
    return res.status(400).send("State is required");
  }
  connection.query(
    `SELECT state, property_tax_rate, income_tax_rate, corporate_tax_rate, state_local_tax_burden, sales_tax_rate
    FROM Tax
    WHERE state = '${state}'`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

/********************************
 * Advanced City Search Routes *
 ********************************/

// Route 18: GET /search_cities?
// Returns top recommended cities to live in based on user selected criteria in search query
const search_cities = async function (req, res) {
  const city = req.query.city ?? "";
  const state = req.query.state ?? "";
  const population_low = req.query.population_low ?? 0;
  const population_high = req.query.population_high ?? 10000000;
  const total_crimes_low = req.query.total_crimes_low ?? 0;
  const total_crimes_high = req.query.total_crimes_high ?? 100000;
  const avg_sales_price_low = req.query.avg_sales_price_low ?? 0.0;
  const avg_sales_price_high = req.query.avg_sales_price_high ?? 10000000.0;
  const avg_rental_price_low = req.query.avg_rental_price_low ?? 0.0;
  const avg_rental_price_high = req.query.avg_rental_price_high ?? 100000.0;
  const tax_burden_low = req.query.tax_burden_low ?? 0.0;
  const tax_burden_high = req.query.tax_burden_high ?? 1.0;
  const order = req.query.order ?? "avg_sales_price";
  if (
    ![
      "avg_sales_price",
      "avg_rental_price",
      "population",
      "total_crimes",
      "tax_burden",
    ].includes(order)
  ) {
    return res
      .status(400)
      .send(
        "Please sort from: avg_sales_price, avg_rental_price, population, total_crimes or tax_burden"
      );
  }

  // Read the page and page_size query parameters with default values
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;

  // Calculate the offset
  const offset = (page - 1) * pageSize;
  // Optimize query to put the where conditions before join

  connection.query(
    `WITH Crime2019 AS
    (
    SELECT city_id, (violent_crime + property_crime) AS total_crimes
    FROM Crime
    WHERE year = 2019
    AND violent_crime >= 0 AND property_crime >= 0
    AND (violent_crime + property_crime) BETWEEN ${total_crimes_low} AND ${total_crimes_high}
    )
    
    , HomeSales2022 AS
    (
    SELECT city_id, avg_sales_price
    FROM HomeSummary2022
    WHERE avg_sales_price BETWEEN ${avg_sales_price_low} AND ${avg_sales_price_high}
    )
    
    , Rent2022 AS
    (
    SELECT city_id, avg_rental_price
    FROM RentSummary2022
    WHERE avg_rental_price BETWEEN ${avg_rental_price_low} AND ${avg_rental_price_high}
    )
    
    , TaxBurden AS
    (
    SELECT state, state_local_tax_burden AS tax_burden
    FROM Tax
    WHERE state_local_tax_burden BETWEEN ${tax_burden_low} AND ${tax_burden_high}
    )
    
    , CityPop AS
    (
    SELECT city_id, city, county, state, population
    FROM City
    WHERE population BETWEEN ${population_low} AND ${population_high}
    AND state LIKE '${state}%'
    AND city LIKE '${city}%'
    )
    
    SELECT c.city, c.county, c.state, c.population, cri.total_crimes, h.avg_sales_price, r.avg_rental_price, t.tax_burden
    FROM TaxBurden t
    JOIN CityPop c
    ON t.state = c.state
    JOIN Crime2019 cri
    ON c.city_id = cri.city_id
    JOIN HomeSales2022 h
    ON c.city_id = h.city_id
    JOIN Rent2022 r
    ON c.city_id = r.city_id
    ORDER BY ${order}
    LIMIT ${pageSize} OFFSET ${offset}`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 9: GET /search?city=VALUE&state=VALUE
// Description: Landing page, search autocomplete helper
const search = async function (req, res) {
  const searchType = req.query.searchType;
  const searchTerm = req.query.searchTerm;
  // // Add a wildcard to the search term for a LIKE query
  // if (city != "") {
  //   const query =
  //     "SELECT distinct city, state FROM City WHERE city LIKE `${city}%` LIMIT 10";
  // } else {
  //   const query = "SELECT state FROM Tax WHERE City LIKE `${state}%` LIMIT 10";
  // }

  // const searchTerm = req.query.term;
  // const searchType = req.query.type; // 'city' or 'state'

  let query;
  if (searchType === "city") {
    // Fetch distinct city and state pairs
    query = "SELECT DISTINCT city, state FROM City WHERE city LIKE ? LIMIT 10";
  } else if (searchType === "state") {
    // Fetch distinct state names
    query = "SELECT DISTINCT state FROM Tax WHERE state LIKE ? LIMIT 10";
  } else {
    res.status(400).send("Invalid search type");
    return;
  }
  connection.query(query, [`${searchTerm}%`], (err, results) => {
    if (err) {
      // Handle error appropriately
      res.status(500).send("Error querying the database");
      return;
    }
    res.json(results);
  });
};

module.exports = {
  top_cities,
  salesrank_cities,
  safest_cities,
  rentrank_cities,
  taxrank_cities,
  namerank_cities,
  homesold_cities,
  top_states,
  taxrank_states,
  safest_states,
  namerank_states,
  homesold_states,
  city,
  monthly_house_prices,
  monthly_rent_prices,
  yearly_crime,
  state,
  search_cities,
  search,
};
