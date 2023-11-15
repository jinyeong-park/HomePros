const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/top_cities', routes.top_cities);
app.get('/top_states', routes.top_states);
app.get('/city/:city_id', routes.city);
app.get('/state/:state_id', routes.state);
app.get('/search_cities', routes.search_cities);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
