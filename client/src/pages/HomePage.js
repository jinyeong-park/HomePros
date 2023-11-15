import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function HomePage() {
  const [topCities, setTopCities] = useState({});
  
  const [topStates, setTopStates] = useState({});


  useEffect(() => {

    fetch(`http://${config.server_host}:${config.server_port}/top_cities`)
      .then(res => res.json())
      .then(resJson => setTopCities(resJson));
    
    fetch(`http://${config.server_host}:${config.server_port}/top_states`)
      .then(res => res.json())
      .then(resJson => setTopStates(resJson));

  }, []);

  const cityColumns = [
    {
      field: 'city',
      headerName: 'City',
    },
    {
      field: 'county',
      headerName: 'County'
    },
    {
      field: 'state',
      headerName: 'State'
    },
    {
      field: 'population',
      headerName: 'Population'
    },
    {
      field: 'total_crimes',
      headerName: 'Total Crime'
    },
    {
      field: 'avg_sales_price',
      headerName: 'Average Home Sale Price',
    },
    {
      field: 'tax_burden',
      headerName: 'Tax Burden'
    },
  ];

  const stateColumns = [
    {
      field: 'state',
      headerName: 'State',
      // renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.title}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'state_local_tax_burden',
      headerName: 'Tax Burden'
    },
    {
      field: 'total_crimes',
      headerName: 'Total Crime'
    },
    {
      field: 'index_score',
      headerName: 'Index'
    },
  ];

  return (
    <Container>
      
      <h2>Top cities and states:&nbsp;
      </h2>
      <Divider />
      <h2>Top Cities</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_cities`} columns={cityColumns} />
      <Divider />
      <h2>Top States</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_states`} columns={stateColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]} />
      <Divider />
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
    </Container>
  );
};