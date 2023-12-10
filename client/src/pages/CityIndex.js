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
    const [appliedFilters, setAppliedFilters] = useState({});

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
      // setAppliedFilters(filters);
      setAppliedFilters((prevFilters) => {
        setStateData([])
        console.log("app filter", stateData);
        setLoading(true)
        setHasMorePages(true);
        setPageSize(15);
        setPageNumber(1);
        
        return filters;
      });  
        /* setStateData([])
        console.log("app filter", stateData);
        setLoading(true)
        setHasMorePages(true);
        setPageSize(15);
        setPageNumber(1); */
      // fetchData(selectedValue, 15, 1, filters)
    };
    
    const handleSelect = (value) => {
      // Reset page size and number when a new option is selected
      setSelectedValue((prevValue) => {
        setStateData([])
        console.log("app filter", stateData);
        setLoading(true)
        setHasMorePages(true);
        setPageSize(15);
        setPageNumber(1);
        
        return value;
      });  
      
      // fetchData(value, 15, 1, appliedFilters);
    };

    const fetchData = (option, size, number, filters) => {
      setLoading(true);
      
      let filterString = '';
      if (filters){
        Object.keys(filters).forEach((key) => {
          filterString += `&${key}_low=${filters[key][0]}&${key}_high=${filters[key][1]}`;
        });
      }
      // console.log(filterString);
      // Update the API endpoint based on the selected option, page size, and page number
      let endpoint;
      switch (option) {
          case 'Alphabetical':
              endpoint = `http://${config.server_host}:${config.server_port}/search_cities?order=city&page_size=${size}&page=${number}${filterString}`;
              break;
          case 'Tax Burden':
              endpoint = `http://${config.server_host}:${config.server_port}/search_cities?order=tax_burden&page_size=${size}&page=${number}${filterString}`;
              break;
          case 'Crime':
              endpoint = `http://${config.server_host}:${config.server_port}/search_cities?order=total_crimes&page_size=${size}&page=${number}${filterString}`;
              break;
          case 'Avg Sale Price':
              endpoint = `http://${config.server_host}:${config.server_port}/search_cities?order=avg_sales_price&page_size=${size}&page=${number}${filterString}`;
              break;
          case 'Avg Rent':
              endpoint = `http://${config.server_host}:${config.server_port}/search_cities?order=avg_rental_price&page_size=${size}&page=${number}${filterString}`;
              break;
          case 'Population':
            endpoint = `http://${config.server_host}:${config.server_port}/search_cities?order=population&page_size=${size}&page=${number}${filterString}`;
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
    if (containerRef.current) {
      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
 
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
      console.log("before", stateData);
      fetchData(selectedValue, pageSize, pageNumber, appliedFilters);
      
    }, [pageNumber, selectedValue,appliedFilters]);

    const dropDownOptions = ['Alphabetical', 'Tax Burden', 'Crime', 'Avg Sale Price', 'Avg Rent', 'Population'];
    console.log("after",stateData);
    return (
      <Container maxWidth="xl" disableGutters>
        <br></br>
        <Typography variant="h4">Cities</Typography>
        <br></br>
        <DropDownSelector options={dropDownOptions} onSelect={handleSelect} defaultValue={dropDownOptions[0]} />
        <div>
        <Button onClick={handleOpenModal} variant='text'>Advanced Search</Button>
        <AdvancedSearchModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onApplyFilters={handleApplyFilters}
        />
        </div>
        <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', maxHeight: '1200px', overflowY: 'scroll' }}>
        {stateData.map((city, index) => (
          <LocationCard 
          key={index} 
          num={index+1} 
          title={city.city} 
          imgSource={`${city.city},${city.state}`} 
          content={<>County: {city.county} <br /> State: {city.state}</>} url={`/city/${city.city}/${city.state}`} 
          longitude={city.longitude} 
          latitude={city.latitude}/>
        ))}
        {loading && <p><br></br>Loading...</p>}
        </div>
      </Container>
    );
  }
