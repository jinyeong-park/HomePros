import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CreateAvgData from './CreateAvgData';

const config = require('../config.json');


const LineChart = ({ city, state }) => {
  const [category, setCategory] = React.useState('Avg Home Price');
  // const [initialData, SetInitialData] = useState([]);
  const [averagedData, setAveragedData] = useState([]);
  const [loading, setLoading] = useState(true);


   // 1. when a page loading for the first time, run only once.
   useEffect(() => {
    const fetchDataAndSetAveragedData = async () => {
      try {
        let endpoint = `http://${config.server_host}:${config.server_port}/monthly_house_prices?city=${city}&state=${state}`;
        
        if (endpoint) {
          console.log("endpoint", endpoint);
          const response = await fetch(endpoint);
          const resJson = await response.json();

          if (resJson.length > 0) {
            // call CreateAvgData fn
            const reorganizedData = CreateAvgData(resJson, category);
            console.log('reorganizedData0', reorganizedData);
            

            const processedData = 
            {
              labels: reorganizedData.map((d)=> d.year),
              datasets: [{
                  label: category,
                  data: reorganizedData.map((d)=> d.avg_median_sale_price)
              }]
            }
            setAveragedData(processedData);

            // console.log('averagedData', averagedData);
          } else {
            console.log('No data available');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false when the data fetching is complete
      }
    };
  
    fetchDataAndSetAveragedData();
  }, []);

    //2. Update when category changes
    useEffect(() => {
      fetchData(city, state, category)
  
    }, [category]);

  // Make fetchData an async function
  const fetchData = async (city, state, category) => {
    setLoading(true);
    let endpoint;

    switch (category) {
      case 'Avg Home Price':
        endpoint = `http://${config.server_host}:${config.server_port}/monthly_house_prices?city=${city}&state=${state}`;
        break;
      case 'Avg Rent Price':
        endpoint = `http://${config.server_host}:${config.server_port}/monthly_rent_prices?city=${city}&state=${state}`;
        break;
      default:
        endpoint = '';
    }
    console.log('endpoint', endpoint)
    try {
      if (endpoint) {
        const response = await fetch(endpoint);
        const resJson = await response.json();
        console.log('resJson.length', resJson.length)
        if (resJson.length > 0) {
          const reorganizedData = CreateAvgData(resJson, category);
          console.log('reorganizedData1', reorganizedData)

          if (reorganizedData) {
            console.log('reorganizedData2', reorganizedData)

            if (category === 'Avg Home Price')  {
              setAveragedData({
                labels: reorganizedData.map((d) => d.year),
                datasets: [
                  {
                    label: category,
                    data: reorganizedData.map((d) => d.avg_median_sale_price),
                  },
                ],
              });
            } else if (category === 'Avg Rent Price') {
              console.log('category is Avg Rent Price')
                setAveragedData({
                  labels: reorganizedData.map((d) => d.year),
                  datasets: [
                    {
                      label: category,
                      data:  reorganizedData.map((d) => d.avg_rental_price),
                    },
                  ],
                });

            }
          } else {
            console.log('CreateAvgData returned undefined or unexpected value.');
            setAveragedData([]); // Set an empty array if there is an issue with the data
          }
        } else {
          console.log('No data available');
          setAveragedData([]); // Set an empty array if there is no data
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  



  const handleChange = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    setLoading(true);
    
    // fetchData(city, state, newCategory)

   
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <FormControl sx={{ m: 1, minWidth: 120, marginLeft: 'auto' }}>
          <Select
            value={category}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="Avg Home Price">Avg Home Price</MenuItem>
            <MenuItem value="Avg Rent Price">Avg Rent Price</MenuItem>
            <MenuItem value="Total Crime">Total Crime</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Line data={averagedData && averagedData.labels ? averagedData : {}} />
      )}
    </>
  );
};

export default LineChart;
