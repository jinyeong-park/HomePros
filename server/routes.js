const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/********************************
 * Top cities Routes *
 ********************************/

// Route 1: GET /top_cities
const top_cities = async function(req, res) {
 
  // query pending updates
  connection.query(`
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
  LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


/********************************
 * Top_states Routes *
 ********************************/

// Route 2: GET /top_states
// Show recommendations of a list of states to live in based on editorial suggestions (based on pre-set filters)
const top_states = async function(req, res) {
 
  // query pending updates
  connection.query(`
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
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/********************************
 * Basic City/State Info Routes *
 ********************************/

// Route 3: GET /city/:city_id
// Show housing, crime, tax and other info about the city
const city = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data[0]
  // Most of the code is already written for you, you just need to fill in the query
  const city_id = req.params.city_id;
  connection.query(`
    SELECT *
    FROM Songs
    WHERE song_id = '${song_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /state/:state_id
// Show cities in the state based on ???
const state = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const state_id = req.params.state_id;
  connection.query(`
    SELECT *
    FROM Albums
    WHERE album_id = '${album_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  })
}


/************************
 * Search Info Routes *
 ************************/


// Route 5: GET /search_cities
// search for cities based on condition
const search_cities = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const playsLow = req.query.plays_low ?? 0;
  const playsHigh = req.query.plays_high ?? 1100000000;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  connection.query(`
    SELECT *
    FROM Songs
    WHERE title LIKE '%${title}%'
    AND duration >= ${durationLow} AND duration <= ${durationHigh}
    AND plays >= ${playsLow} AND plays <= ${playsHigh}
    AND danceability >= ${danceabilityLow} AND danceability <= ${danceabilityHigh}
    AND energy >= ${energyLow} AND energy <= ${energyHigh}
    AND valence >= ${valenceLow} AND valence <= ${valenceHigh}
    AND explicit <= ${explicit}
    ORDER BY title;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  })
}

module.exports = {
  top_cities,
  top_states,
  city,
  state,
  search_cities,
}
