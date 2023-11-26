import React, { useEffect, useState, useRef } from 'react';
import { Container, Button, Typography } from '@mui/material';
import LocationCard from '../components/LocationCard';
import DropDownSelector from '../components/DropDownSelector';
import AdvancedSearchModal from '../components/AdvancedCitySearch';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');
    
export default function StateIndex() {
    const [stateData, setStateData] = useState([]);
    const [selectedValue, setSelectedValue] = useState('Alphabetical');
    const [pageSize, setPageSize] = useState(15);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMorePages, setHasMorePages] = useState(true);

    // modal manager
    const [isModalOpen, setIsModalOpen] = useState(false);


    const containerRef = useRef(null);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const handleApplyFilters = (filters) => {
      // Handle the applied filters
      console.log('Applied filters:', filters);
    };
    
    const handleSelect = (value) => {
      setSelectedValue(value);
      // Reset page size and number when a new option is selected
      setStateData([])
      setLoading(true)
      setHasMorePages(true);
      setPageSize(15);
      setPageNumber(1);
      fetchData(value, 15, 1);
    };

    const fetchData = (option, size, number) => {
      setLoading(true);
      // Update the API endpoint based on the selected option, page size, and page number
      let endpoint;
      switch (option) {
          case 'Alphabetical':
              endpoint = `http://${config.server_host}:${config.server_port}/namerank_cities?page_size=${size}&page=${number}`;
              break;
          case 'Score':
              endpoint = `http://${config.server_host}:${config.server_port}/top_cities?page_size=${size}&page=${number}`;
              break;
          case 'Tax Burden':
              endpoint = `http://${config.server_host}:${config.server_port}/taxrank_cities?page_size=${size}&page=${number}`;
              break;
          case 'Crime':
              endpoint = `http://${config.server_host}:${config.server_port}/safest_cities?page_size=${size}&page=${number}`;
              break;
          case 'Avg Sale Price':
              endpoint = `http://${config.server_host}:${config.server_port}/salesrank_cities?page_size=${size}&page=${number}`;
              break;
          case 'Avg Rent':
              endpoint = `http://${config.server_host}:${config.server_port}/rentrank_cities?page_size=${size}&page=${number}`;
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
      // Trigger handleSelect with the defaultValue when the page first loads
      handleSelect(dropDownOptions[0]);
    }, []); // Empty dependency array ensures this runs only once on mount


    useEffect(() => {
      console.log(containerRef.current);
    if (containerRef.current) {
      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
        console.log(scrollHeight, scrollTop, scrollHeight-scrollTop,  clientHeight)
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
      // Fetch data when the page number changes
      if (pageNumber != 1){    
        fetchData(selectedValue, pageSize, pageNumber);
      }
    }, [pageNumber]);

    const dropDownOptions = ['Alphabetical', 'Score', 'Tax Burden', 'Crime', 'Avg Sale Price', 'Avg Rent'];

    return (
      <Container maxWidth="xl" disableGutters>
        <Typography variant="h2">Cities</Typography>
        <DropDownSelector options={dropDownOptions} onSelect={handleSelect} defaultValue={dropDownOptions[0]} />
        <div>
        <Button onClick={handleOpenModal}>Open Advanced Search</Button>
        <AdvancedSearchModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onApplyFilters={handleApplyFilters}
        />
        </div>
        <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', maxHeight: '1200px', overflowY: 'scroll' }}>
        {stateData.map((city, index) => (
          <LocationCard key={index} num={index+1} title={city.city} content={<>County: {city.county} <br /> State: {city.state}</>}/>
        ))}
        {loading && <p><br></br>Loading...</p>}
        </div>
      </Container>
    );
  }
