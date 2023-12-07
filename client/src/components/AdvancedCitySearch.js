import React, { useState } from 'react';
import { Modal, Box, Typography, Slider, Button, Grid, Item } from '@mui/material';

const AdvancedSearchModal = ({ open, onClose, onApplyFilters }) => {
    const [avgHomePriceRange, setAvgHomePriceRange] = useState([0, 10000000]);
    const [rentRange, setRentRange] = useState([0, 50000]);
    const [taxBurdenRange, setTaxBurdenRange] = useState([0, 1]);
    const [totalCrimeRange, setTotalCrimeRange] = useState([0, 100000]);
    const [populationRange, setPopulationRange] = useState([0, 100000000]); 
  
    const handleHomePriceChange = (event, newValue) => {
        setAvgHomePriceRange(newValue);
      };
    
      const handleRentChange = (event, newValue) => {
        setRentRange(newValue);
      };
    
      const handleTaxBurdenChange = (event, newValue) => {
        setTaxBurdenRange(newValue);
      };
    
      const handleCrimeChange = (event, newValue) => {
        setTotalCrimeRange(newValue);
      };
    
      const handlePopulationChange = (event, newValue) => {
        setPopulationRange(newValue);
      };
    
      const handleApplyFilters = () => {
        // Pass the selected filters to the parent component
        onApplyFilters({
          avg_sales_price: avgHomePriceRange,
          avg_rental_price: rentRange,
          tax_burden: taxBurdenRange,
          total_crimes: totalCrimeRange,
          population: populationRange,
        });
        // Close the modal
        onClose();
      };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1200,
          height: 550,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography variant="h5">Advanced Search Filters</Typography>
        <br></br>
        <Grid container rowSpacing={1} columnSpacing={10} justifyContent="space-around" >
        <Grid item xs={5}>
        <Typography gutterBottom>Home Price Range</Typography>
        <br></br>
        <br></br>
        <Slider
          value={avgHomePriceRange}
          onChange={handleHomePriceChange}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `$${value}`}
          step = {1000}
          min={0}
          max={10000000}
        />
        </Grid>
        <Grid item xs={5}>
        
 <Typography gutterBottom>Rent Range</Typography>
 <br></br><br></br>
        <Slider
          value={rentRange}
          onChange={handleRentChange}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `$${value}`}
          step = {100}
          min={0}
          max={50000}
        />
        </Grid>

        <Grid item xs={5}>
        
 <Typography gutterBottom>Tax Burden Range</Typography>
 <br></br><br></br>
        <Slider
          value={taxBurdenRange}
          onChange={handleTaxBurdenChange}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `${value}%`}
          step = {0.01}
          min={0}
          max={1}
        /></Grid>
        <Grid item xs={5}>
        
 <Typography gutterBottom>Crime Range</Typography>
 <br></br><br></br>
        <Slider
          value={totalCrimeRange}
          onChange={handleCrimeChange}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `${value}`}
          step = {1}
          min={0}
          max={100000}
        /></Grid>
        <Grid item xs={5}>
        
<Typography gutterBottom>Population Range</Typography>
<br></br><br></br>
        <Slider
          value={populationRange}
          onChange={handlePopulationChange}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => `${value}`}
          step = {10000}
          min={0}
          max={100000000}
        /></Grid>
        </Grid>


        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdvancedSearchModal;
