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
 * Author Information Routes *
 ********************************/

// Route 1: GET /author/:type
// Get the author team information
const author = async function(req, res) {
  // Show author names
  const team = 'Team HomePros';

  // checks the value of type the request parameters
  if (req.params.type === 'team') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${team}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid type is 'team'.`);
  }
}

/********************************
 * Editorial Suggestion Routes *
 ********************************/

// Route 2: GET /editorial
// Show recommendations of a list of cities to live in based on editorial suggestions (based on pre-set filters)
const random = async function(req, res) {
 
  // query pending updates
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // If there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
      // return type you may need to return an empty array [] instead.
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id,
        title: data[0].title
      });
    }
  });
}

/********************************
 * Basic City/State Info Routes *
 ********************************/

// Route 3: GET /city/:city_id
// Show housing, crime, tax and other info about the city
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data[0]
  // Most of the code is already written for you, you just need to fill in the query
  const song_id = req.params.song_id;
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
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const album_id = req.params.album_id;
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

// Route 5: GET /states
// Show all 50 states in a list
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(`
    SELECT *
    FROM Albums
    ORDER BY release_date DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  })
}

// Route 6: ----
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const album_id = req.params.album_id;
  connection.query(`
    SELECT song_id, title, number, duration, plays
    FROM Songs
    WHERE album_id = '${album_id}'
    ORDER BY number
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  })
}

/************************
 * Search Info Routes *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
      SELECT s.song_id, s.title, a.album_id, a.title AS album, s.plays
      FROM Songs s
      JOIN Albums a
      ON s.album_id = a.album_id
      ORDER BY s.plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })

  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    connection.query(`
      SELECT s.song_id, s.title, a.album_id, a.title AS album, s.plays
      FROM Songs s
      JOIN Albums a
      ON s.album_id = a.album_id
      ORDER BY s.plays DESC
      LIMIT ${pageSize} OFFSET ${pageSize * (page-1)}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    connection.query(`
      SELECT a.album_id, a.title, SUM(s.plays) AS plays
      FROM Songs s
      JOIN Albums a
      ON s.album_id = a.album_id
      GROUP BY a.album_id, a.title
      ORDER BY plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })

  } else {
    // with pagination
    connection.query(`
      SELECT a.album_id, a.title, SUM(s.plays) AS plays
      FROM Songs s
      JOIN Albums a
      ON s.album_id = a.album_id
      GROUP BY a.album_id, a.title
      ORDER BY plays DESC
      LIMIT ${pageSize} OFFSET ${pageSize * (page-1)}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    })
  }
}

// Route 9: GET /search_songs
// search for cities based on condition
const search_songs = async function(req, res) {
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
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
}
