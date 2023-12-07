import React, { useEffect, useState, useRef } from 'react';
import { Container, Box, Typography } from '@mui/material';
import LocationCard from '../components/LocationCard';
import DropDownSelector from '../components/DropDownSelector';

const config = require('../config.json');

export default function StateIndex() {
  const [stateData, setStateData] = useState([]);
  const [selectedValue, setSelectedValue] = useState('Alphabetical');
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMorePages, setHasMorePages] = useState(true);
  const containerRef = useRef(null);

  const handleSelect = (value) => {
    setSelectedValue(value);
    // Reset page size and number when a new option is selected
    setStateData([])
    setLoading(true)
    setHasMorePages(true);
    setPageSize(15);
    setPageNumber(1);
    // fetchData(value, 15, 1);
  };

  const fetchData = (option, size, number) => {
    setLoading(true);
    // Update the API endpoint based on the selected option, page size, and page number
    let endpoint;
    switch (option) {
      case 'Alphabetical':
        endpoint = `http://${config.server_host}:${config.server_port}/namerank_states?page_size=${size}&page=${number}`;
        break;
      case 'Score':
        endpoint = `http://${config.server_host}:${config.server_port}/top_states?page_size=${size}&page=${number}`;
        break;
      case 'Tax Burden':
        endpoint = `http://${config.server_host}:${config.server_port}/taxrank_states?page_size=${size}&page=${number}`;
        break;
      case 'Crime':
        endpoint = `http://${config.server_host}:${config.server_port}/safest_states?page_size=${size}&page=${number}`;
        break;
      default:
        endpoint = '';
    }

    if (endpoint) {
      fetch(endpoint)
        .then((res) => res.json())
        .then((resJson) => {

        if (resJson.length > 0){
            setStateData((prevData) => [...prevData, ...resJson]);
            setLoading(false);
        }
        else {
            setHasMorePages(false);
            setLoading(false);
        }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  };
  
  useEffect(() => {
    // console.log(containerRef.current);
   if (containerRef.current) {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
      // console.log(scrollHeight, scrollTop, scrollHeight-scrollTop,  clientHeight)
      if (scrollTop + clientHeight >= scrollHeight && !loading && hasMorePages) {
        // Load more data when the user scrolls to the bottom
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    };

    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }
  }, [loading, hasMorePages]);

  useEffect(() => {
    console.log(pageNumber);// Fetch data when the page number changes 
    fetchData(selectedValue, pageSize, pageNumber);
    
    }, [pageNumber, selectedValue]);

  const dropDownOptions = ['Alphabetical', 'Score', 'Tax Burden', 'Crime'];

  return (
    <Container maxWidth="xl" disableGutters>
      <br></br>
      <Typography variant="h4">States</Typography>
        <br></br>
      <DropDownSelector options={dropDownOptions} onSelect={handleSelect} defaultValue={dropDownOptions[0]} />
      <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', maxHeight: '1200px', overflowY: 'scroll' }}>
      {stateData.map((state, index) => (
        <LocationCard key={index} num={index+1} imgSource={state.state} title={state.state} content={``} url={`/state/${state.state}`} disableWeather={true}/>
      ))}
      {loading && <p>Loading...</p>}
      </div>
    </Container>
  );
}
