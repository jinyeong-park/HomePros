import React from 'react'
// import * as React from 'react';
import { Line } from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



const LineChart = ({chartData}) => {
  const [category, setCategory] = React.useState('');
  const handleChange = (event) => {
    setCategory(event.target.value);
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
      <Line data={chartData}/>
    </>
   
  )
}

export default LineChart

