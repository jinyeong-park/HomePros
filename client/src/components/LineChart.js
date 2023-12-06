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
  const [averagedData, setAveragedData] = useState([]);
  const [loading, setLoading] = useState(true);



   // 1. when a page loading for the first time, run only once.
   useEffect(() => {
    const fetchDataAndSetAveragedData = async () => {
      try {
        let endpoint = `http://${config.server_host}:${config.server_port}/monthly_house_prices?city=${encodeURIComponent(city)}&state=${state}`;

        
        if (endpoint) {
         
          const response = await fetch(endpoint);
          const resJson = await response.json();
      

          if (resJson.length > 0) {
            // call helper function - CreateAvgData
            const reorganizedData = CreateAvgData(resJson, category);
         
            const processedData = ({
              labels: reorganizedData?.map((d, i, arr) => d.month ? (i > 0 && arr[i - 1].year === d.year ? `` : `${d.year}`) : `${d.year}`),
              datasets: [
                {
                    label: category,
                    data: reorganizedData?.map((d) =>  d.avg_median_sale_price),
                    borderColor: '#d90429',
                    pointRadius: 0,
                    borderWidth: 2
                  },
                  {
                    label: "Condo/Co-op",
                    data: resJson?.filter((d) => d.property_type === "Condo/Co-op").map((d) => d.median_sale_price),
                    pointRadius: 0,
                    borderColor: '#386641',
                    borderWidth: 2,
                  },
                  {
                    label: "Multi-Family (2-4 Unit)",
                    data: resJson?.filter((d) => d.property_type === "Multi-Family (2-4 Unit)").map((d) => d.median_sale_price),
                    pointRadius: 0,
                    borderWidth: 2,
                    borderColor: '#006494'
                  },
                  {
                    label: "Single Family Residential",
                    data: resJson?.filter((d) => d.property_type === "Single Family Residential").map((d) => d.median_sale_price),
                    pointRadius: 0,
                    borderWidth: 2,
                    borderColor:  '#ffc300'
                  },
                  {
                    label: "Townhouse",
                    data: resJson?.filter((d) => d.property_type === "Townhouse").map((d) => d.median_sale_price),
                    pointRadius: 0,
                    borderWidth: 2,
                    borderColor: '#00a6fb'
                  },
                ],
              });
           
            setAveragedData((prevData) => ({ ...prevData, ...processedData }));

          } else {
            console.log('No data available-first useeffect');
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
      case 'Avg Rent Price':
        endpoint = `http://${config.server_host}:${config.server_port}/monthly_rent_prices?city=${city}&state=${state}`;
        break;
      case 'Total Crime':
          endpoint = `http://${config.server_host}:${config.server_port}/yearly_crime?city=${city}&state=${state}`;
          break;
      // default : Avg Home Price
      default:
        endpoint = `http://${config.server_host}:${config.server_port}/monthly_house_prices?city=${city}&state=${state}`;
    }
  
    try {
      if (endpoint) {
        const response = await fetch(endpoint);
        const resJson = await response.json();
        
        
        if (resJson.length > 0) {

          let reorganizedData;
        
            if (category === 'Avg Home Price')  {
              reorganizedData = CreateAvgData(resJson, category);

              setAveragedData((prevData) => ({
                ...prevData,
                labels: reorganizedData?.map((d, i, arr) => d.month ? (i > 0 && arr[i - 1].year === d.year ? `` : `${d.year}`) : `${d.year}`),
                datasets: [
                  {
                      label: category,
                      data: reorganizedData?.map((d) =>  d.avg_median_sale_price),
                      borderColor: 'orange',
                      pointRadius: 0,
                      borderWidth: 2
                    },
                    {
                      label: "Condo/Co-op",
                      data: resJson?.filter((d) => d.property_type === "Condo/Co-op").map((d) => d.median_sale_price),
                      pointRadius: 0,
                      borderColor: 'green',
                      borderWidth: 2,
                    },
                    {
                      label: "Multi-Family (2-4 Unit)",
                      data: resJson?.filter((d) => d.property_type === "Multi-Family (2-4 Unit)").map((d) => d.median_sale_price),
                      pointRadius: 0,
                      borderWidth: 2,
                      borderColor: 'purple'
                    },
                    {
                      label: "Single Family Residential",
                      data: resJson?.filter((d) => d.property_type === "Single Family Residential").map((d) => d.median_sale_price),
                      pointRadius: 0,
                      borderWidth: 2,
                      borderColor:  'red'
                    },
                    {
                      label: "Townhouse",
                      data: resJson?.filter((d) => d.property_type === "Townhouse").map((d) => d.median_sale_price),
                      pointRadius: 0,
                      borderWidth: 2,
                      borderColor: '#00a6fb'
                    },
                  ],
                }));
              } else if ( category === 'Avg Rent Price')  {
                  reorganizedData = CreateAvgData(resJson, category);

                  setAveragedData((prevData) => ({
                    ...prevData,
                    labels: reorganizedData?.map((d, i, arr) => d.month ? (i > 0 && arr[i - 1].year === d.year ? `` : `${d.year}`) : `${d.year}`),
                    datasets: [
                      {
                        label: category,
                        pointRadius: 0,
                        data: reorganizedData?.map((d) =>d.avg_rental_price),
                        },
                      ],
                    }));
              } else if (category === 'Total Crime') {
                setAveragedData((prevData) => ({
                  ...prevData,
                    labels: resJson?.map((d) => d.year),
                    datasets: [
                      {
                        label: category,
                        pointRadius: 0,
                        tension: 0.1,
                        data:  resJson?.map((d) => d.total_crimes),
                      },
                    ],
                  }));
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
      ) : averagedData ? (
        <Line data={averagedData && averagedData.labels ? averagedData : {}} />
      ) : (
        <p>No data available</p>
      )}
    </>
  );
};

export default LineChart;

