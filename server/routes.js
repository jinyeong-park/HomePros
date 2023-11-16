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
 * Basic City/State Info Routes *
 ********************************/

// Route 1: GET /top_cities
// Show housing, crime, tax and other info about the city
const top_cities = async function (req, res) {
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
  )
  
  , HomeSales2022 AS
  (
  SELECT city_id, AVG(median_sale_price) AS avg_sales_price
  FROM HomeSales
  WHERE year = 2022
  GROUP BY city_id
  )
  
  , Rent2022 AS
  (
  SELECT city_id, AVG(rental_price) AS avg_rental_price
  FROM Rent
  WHERE year = 2022
  GROUP BY city_id
  )
  
  SELECT c.city, c.county, c.state, c.population, cri.total_crimes, h.avg_sales_price, t.state_local_tax_burden AS tax_burden
  FROM City c
  JOIN Crime2019 cri
  ON c.city_id = cri.city_id
  JOIN HomeSales2022 h
  ON c.city_id = h.city_id
  JOIN Rent2022 r
  ON c.city_id = r.city_id
  JOIN Tax t
  ON c.state = t.state
  WHERE c.population > 10000
  AND cri.total_crimes < 1000
  AND h.avg_sales_price <= 700000
  AND r.avg_rental_price <= 2000
  AND t.state_local_tax_burden < 0.1
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

// // Route 2: GET /top_states
// //  retrieves states information for the top five states to live with overall good safety and tax burden, rank from total crimes and tax burden from lowest to highest based on fixed selection criteria.
const top_states = async function (req, res) {
  connection.query(
    `
    WITH Crime2019 AS
    (
    SELECT city_id, (violent_crime + property_crime) AS total_crimes
    FROM Crime
    WHERE year = 2019
    )
    
    SELECT c.state, t.state_local_tax_burden, SUM(cri.total_crimes) AS total_crimes,
    (0.5 * ((SUM(cri.total_crimes) - AVG(SUM(cri.total_crimes)) OVER()) / STDDEV( SUM(cri.total_crimes)) OVER())) + (0.5 * ((SUM(t.state_local_tax_burden) - AVG(SUM(t.state_local_tax_burden)) OVER()) / STDDEV( SUM(t.state_local_tax_burden)) OVER())) AS index_score
    FROM City c
    JOIN Crime2019 cri
    ON c.city_id = cri.city_id
    JOIN Tax t
    ON c.state = t.state
    GROUP BY c.state, t.state_local_tax_burden
    ORDER BY index_score
    LIMIT 5
    
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

// // Route 3: GET /expensive_cities
// //  returns 10 most expensive cities to live in by housing price, show cities rank from highest price to lowest price. Based on latest available year data
const expensive_cities = async function (req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  // const state_id = req.params.state_id;
  connection.query(
    `
    WITH HomeSales2022 AS
(
SELECT city_id, AVG(median_sale_price) AS avg_sales_price
FROM HomeSales
WHERE year = 2022
GROUP BY city_id
)

SELECT c.city, c.county, c.state, h.avg_sales_price
FROM City c
JOIN HomeSales2022 h
ON c.city_id = h.city_id
ORDER BY h.avg_sales_price DESC
LIMIT 10  
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

// // Route 4: GET /safest_cities
// // returns safest cities to live in from lowest crime numbers to highest crime numbers with population greater than 200000. Based on latest available year data
const safest_cities = async function (req, res) {
  connection.query(
    `
    WITH Crime2019 AS
    (
    SELECT city_id, (violent_crime + property_crime) AS total_crimes
    FROM Crime
    WHERE year = 2019 AND violent_crime IS NOT NULL AND property_crime IS NOT NULL
    )
    
    SELECT c.city, c.county, c.state, c.population, cri.total_crimes
    FROM City c
    JOIN Crime2019 cri
    ON c.city_id = cri.city_id
    WHERE c.population >= 200000
    ORDER BY total_crimes      
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
// Route 5: GET /city?city=VALUE&state=VALUE
// returns most recent city information for a specific city, state inputted by a user.
const city = async function (req, res) {
  const city = req.query.city;
  const state = req.query.state;
  console.log(state);
  if (!city || !state) {
    return res.status(400).send("City and state are required");
  }
  connection.query(
    `WITH Crime2019Detail AS
    (
    SELECT *
    FROM Crime
    WHERE year = 2019
    )

    , HomeSales2022Dec AS
    (
    SELECT *
    FROM HomeSales
    WHERE year = 2022 AND month = 12
    )

    , Rent2022Dec AS
    (
    SELECT *
    FROM Rent
    WHERE year = 2022 AND month = 12
    )

    SELECT c.city, c.county, c.state, c.population, cri.violent_crime, cri.murder, cri.rape, cri.robbery, cri.aggravated_assault, cri.property_crime, cri.burglary, cri.motor_vehicle_theft, cri.arson, h.median_sale_price, h.median_list_price, h.median_ppsf, h.median_list_ppsf, h.property_type, h.homes_sold, h.pending_sales, h.new_listings, h.inventory, h.price_drops, h.off_market_in_two_weeks, r.rental_price, t.property_tax_rate, t.income_tax_rate, t.corporate_tax_rate, t.sales_tax_rate, t.state_local_tax_burden
    FROM City c
    LEFT JOIN Crime2019Detail cri
    ON c.city_id = cri.city_id
    LEFT JOIN HomeSales2022Dec h
    ON c.city_id = h.city_id
    LEFT JOIN Rent2022Dec r
    ON c.city_id = r.city_id
    LEFT JOIN Tax t
    ON c.state = t.state
    WHERE c.city = '${city}' AND c.state = '${state}'`,
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

// // Route 6: GET /top_housingmarket
// // returns information on the most popular housing market by how many houses were sold in the last year, from highest to lowest based on fixed selection criteria
const top_housingmarket = async function (req, res) {
  connection.query(
    `
    WITH HomeSalesCount AS
    (
    SELECT city_id, SUM(homes_sold) AS home_sold
    FROM HomeSales
    WHERE year = 2022
    GROUP BY city_id
    )
    
    SELECT c.city, c.county, c.state, h.home_sold
    FROM City c
    JOIN HomeSalesCount h
    ON c.city_id = h.city_id
    ORDER BY h.home_sold DESC         
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

// // Route 7: GET /monthly_house_prices
// //  Show housing prices and market trends by month from a specific city from all available data.
const monthly_house_prices = async function (req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const city = req.query.city;
  const state = req.query.state;
  console.log(state);
  if (!city || !state) {
    return res.status(400).send("City and state are required");
  }
  connection.query(
    `
    SELECT c.city, c.county, c.state, h.month, h.year, h.median_sale_price, h.median_list_price, h.median_ppsf, h.median_list_ppsf, h.property_type, h.homes_sold, h.pending_sales, h.new_listings, h.inventory, h.price_drops, h.off_market_in_two_weeks
    FROM City c
    JOIN HomeSales h
    ON c.city_id = h.city_id
    WHERE c.city = '${city}' AND c.state = '${state}'
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

// Route 8: GET /search_cities?
// sDescription: returns top 10 recommended cities to live in based on user selected criteria in search query
const search_cities = async function (req, res) {
  // const city = req.query.city ?? "";
  // const state = req.query.state ?? "";
  const population_low = req.query.population_low ?? 0;
  const population_high = req.query.population_high ?? 10000000;
  const total_crimes_low = req.query.total_crimes_low ?? 0;
  const total_crimes_high = req.query.total_crimes_high ?? 100000;
  const avg_sales_price_low = req.query.avg_sales_price_low ?? 0.0;
  const avg_sales_price_high = req.query.avg_sales_price_high ?? 10000000.0;
  const avg_rental_price_low = req.query.avg_rental_price_low ?? 0.0;
  const avg_rental_price_high = req.query.avg_rental_price_high ?? 100000.0;
  const state_local_tax_burden_low =
    req.query.state_local_tax_burden_low ?? 0.0;
  const state_local_tax_burden_high =
    req.query.state_local_tax_burden_high ?? 1.0;

  connection.query(
    `
    WITH Crime2019 AS
    (
    SELECT city_id, (violent_crime + property_crime) AS total_crimes
    FROM Crime
    WHERE year = 2019
    )
    
    , HomeSales2022 AS
    (
    SELECT city_id, AVG(median_sale_price) AS avg_sales_price
    FROM HomeSales
    WHERE year = 2022
    GROUP BY city_id
    )
    
    , Rent2022 AS
    (
    SELECT city_id, AVG(rental_price) AS avg_rental_price
    FROM Rent
    WHERE year = 2022
    GROUP BY city_id
    )
    
    SELECT c.city, c.county, c.state, c.population, cri.total_crimes, h.avg_sales_price, r.avg_rental_price, t.state_local_tax_burden AS tax_burden
    FROM City c
    JOIN Crime2019 cri
    ON c.city_id = cri.city_id
    JOIN HomeSales2022 h
    ON c.city_id = h.city_id
    JOIN Rent2022 r
    ON c.city_id = r.city_id
    JOIN Tax t
    ON c.state = t.state
    WHERE c.population BETWEEN ${population_low} AND ${population_high}
    AND cri.total_crimes BETWEEN ${total_crimes_low} AND ${total_crimes_high}
    AND h.avg_sales_price BETWEEN ${avg_sales_price_low} AND ${avg_sales_price_high}
    AND r.avg_rental_price BETWEEN ${avg_rental_price_low} AND ${avg_rental_price_high}
    AND t.state_local_tax_burden BETWEEN ${state_local_tax_burden_low} AND ${state_local_tax_burden_high}
    ORDER BY h.avg_sales_price
    LIMIT 10
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    }
  );
};

module.exports = {
  top_cities,
  top_states,
  expensive_cities,
  safest_cities,
  city,
  top_housingmarket,
  monthly_house_prices,
  search_cities,
};
