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
  const [loading, setLoading] = useState(false);


   // 1. when a page loading, first default setting is Avg Home Price option.- only run once
   useEffect(() => {
    const fetchDataAndSetAveragedData = async () => {
      try {
        let endpoint = `http://${config.server_host}:${config.server_port}/monthly_house_prices?city=${city}&state=${state}`;
  
        if (endpoint) {
          console.log("endpoint", endpoint);
          const response = await fetch(endpoint);
          const resJson = await response.json();
          console.log("resJson", resJson);
  
          if (resJson.length > 0) {
            const reorganizedData = CreateAvgData(resJson);
            console.log("reorganizedData", reorganizedData);
            setAveragedData(reorganizedData);
          } else {
            console.log('No data available');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchDataAndSetAveragedData();
  }, []);

  // Make fetchData an async function
  const fetchData = async (city, state, category) => {
    console.log('city, state, category', city, state, category)
    setLoading(true);
    let endpoint;
  
    switch (category) {
      case 'Avg Home Price':
        console.log("case -avg home price")
        endpoint = `http://${config.server_host}:${config.server_port}/monthly_house_prices?city=${city}&state=${state}`;
        break;
      case 'Avg Rent Price':
        endpoint = `http://${config.server_host}:${config.server_port}/monthly_rent_prices?city=${city}&state=${state}`;
        break;
      default:
        endpoint = '';
    }
  
    try {
      if (endpoint) {
        console.log("endpoint", endpoint)
        const response = await fetch(endpoint);
        const resJson = await response.json();
        console.log("resJson", resJson)
        if (resJson.length > 0) {
          setAveragedData(CreateAvgData(resJson))
         
          // move this to CreateAvgData.js file
          // const groupedData = resJson.reduce((acc, entry) => {
          //   const yearMonthKey = `${entry.year}-${entry.month}`;
          //   if (!acc[yearMonthKey]) {
          //     acc[yearMonthKey] = { sum: 0, count: 0 };
          //   }
          //   acc[yearMonthKey].sum += entry.median_sale_price;
          //   acc[yearMonthKey].count += 1;
          //   console.log('acc', acc)
          //   return acc;

          // }, {});
         
          // const averagedData = Object.keys(groupedData).map((yearMonthKey) => {
          //   const [year, month] = yearMonthKey.split('-');
          //   return {
          //     year: parseInt(year),
          //     month: parseInt(month),
          //     avg_median_sale_price: groupedData[yearMonthKey].sum / groupedData[yearMonthKey].count,
          //   };
          // });
          // console.log('averagedData', averagedData)
          // return averagedData;
         // --------------------------------------
        //   setAveragedData((prevChartData) => {
        //     return {
        //       ...prevChartData,
        //       labels: averagedData.map((d) => `${d.year}-${d.month}`),
        //       datasets: [
        //         {
        //           label: category, // Update the label based on the selected category
        //           data: averagedData.map((d) => d.avg_median_sale_price),
        //         },
        //       ],
        //     };
        //   });
        // } else {
        //   console.log('No data available');
        //   return [];
        // }
      }
    }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
 
  

  //2. when user select other option other than Avg Home Price, useEffect triggers.
  // useEffect(() => {
  //   // Update chartData when selectedData changes
  //   setAveragedData((prevChartData) => {
  //     return {
  //       ...prevChartData,
  //       labels: averagedData.map((d) => `${d.year}-${d.month}`),
  //       datasets: [
  //         {
  //           label: category, // Update the label based on the selected category
  //           data: averagedData.map((d) => d.avg_median_sale_price),
  //         },
  //       ],
  //     };
  //   });
  // }, [averagedData, category]);

  const handleChange = (event) => {
    const newCategory = event.target.value;
  
    setCategory(newCategory);
  
    fetchData(city, state, newCategory)
   
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
      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        <Line data={chartData} />
      )} */}
      <Line data={{
        labels: averagedData.map((d)=> d.year),
        datasets: [{
            label: "Avg Home Price",
            data: averagedData.map((d)=> d.avg_median_sale_price)
        }]
        }} />
    </>
  );
};

export default LineChart;



// const LineChart = ({city, state}) => {
//   const [category, setCategory] = React.useState('Avg Home Price');
//   const [selectedData, setSelectedData] = useState([]);


//   const fetchData = (city, state, category) => {
//     setLoading(true);
//     // Update the API endpoint based on the selected option, page size, and page number
//     let endpoint;
//     switch (option) {
//       case 'Avg Home Price':
//         endpoint = `http://${config.server_host}:${config.server_port}/monthly_house_prices?city=${city}&state=${state}`;
//         break;
//       case 'Avg Rent Price':
//         endpoint = `http://${config.server_host}:${config.server_port}/monthly_rent_prices?city=${city}&state=${state}`;
//         break;
//       default:
//         endpoint = '';
//     }

//     if (endpoint) {
//       fetch(endpoint)
//         .then((res) => res.json())
//         .then((resJson) => {

//         if (resJson.length > 0){
//           setSelectedData((prevData) => [...prevData, ...resJson]);
//         }
//         else {
//             setHasMorePages(false);

//         }
//         })
//         .catch((error) => {
//           console.error('Error fetching data:', error);
//         });
//     }
//   };

//   useEffect(() => {
//     // Update selectedData based on the selected category
//     if (category === 'Avg Home Price') {
//       // Assuming chartData.datasets[0] corresponds to Avg Home Price data
//       setSelectedData(chartData.datasets[0].data);
//     } else if (category === 'Avg Rent Price') {
//       // Assuming chartData.datasets[1] corresponds to Avg Rent Price data
//       setSelectedData(chartData.datasets[1].data);
//     } else if (category === 'Total Crime') {
//       // Assuming chartData.datasets[2] corresponds to Total Crime data
//       setSelectedData(chartData.datasets[2].data);
//     }
//   }, [category, chartData]);

//   const handleChange = (event) => {
//     setCategory(event.target.value);
//     setData
//   };

//   // const updatedChartData = {
//   //   ...chartData,
//   //   datasets: [
//   //     {
//   //       label: category,
//   //       data: selectedData,
//   //       // You may need to adjust other properties based on your actual chart configuration
//   //     },
//   //   ],
//   // }
//   return (
//     <>
//       <Box display="flex" justifyContent="space-between">
//         <FormControl sx={{ m: 1, minWidth: 120, marginLeft: 'auto' }}>
//           <Select
//             value={category}
//             onChange={handleChange}
//             displayEmpty
//             inputProps={{ 'aria-label': 'Without label' }}
//           >
//             <MenuItem value="Avg Home Price">Avg Home Price</MenuItem>
//             <MenuItem value="Avg Rent Price">Avg Rent Price</MenuItem>
//             <MenuItem value="Total Crime">Total Crime</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>
//       <Line data={selectedData}/>
//     </>
   
//   )
// }

// export default LineChart

