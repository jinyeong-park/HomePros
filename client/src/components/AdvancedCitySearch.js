import React, { useState } from 'react';
import { Modal, Box, Typography, Slider, Button, Grid, Item } from '@mui/material';

const AdvancedSearchModal = ({ open, onClose, onApplyFilters }) => {
    const [avgHomePriceRange, setAvgHomePriceRange] = useState([0, 10000000]);
    const [rentRange, setRentRange] = useState([0, 1000000]);
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
          avgHomePriceRange,
          rentRange,
          taxBurdenRange,
          totalCrimeRange,
          populationRange,
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
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography variant="h6">Advanced Search Filters</Typography>

        <Grid container rowSpacing={ 1} columnSpacing={10} >
        <Grid item xs={6}>
        <Typography gutterBottom>Home Price Range</Typography>
        <Slider
          value={avgHomePriceRange}
          onChange={handleHomePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
          step = {1000}
          min={0}
          max={10000000}
        />
        </Grid>
        <Grid item xs={6}>
        
 <Typography gutterBottom>Rent Range</Typography>
        <Slider
          value={rentRange}
          onChange={handleRentChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
          step = {100}
          min={0}
          max={1000000}
        />
        </Grid>

        <Grid item xs={6}>
        
 <Typography gutterBottom>Tax Burden Range</Typography>
        <Slider
          value={taxBurdenRange}
          onChange={handleTaxBurdenChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}%`}
          step = {0.01}
          min={0}
          max={1}
        /></Grid>
        <Grid item xs={6}>
        
 <Typography gutterBottom>Crime Range</Typography>
        <Slider
          value={totalCrimeRange}
          onChange={handleCrimeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}`}
          step = {1}
          min={0}
          max={100000}
        /></Grid>
        <Grid item xs={6}>
        
<Typography gutterBottom>Population Range</Typography>
        <Slider
          value={populationRange}
          onChange={handlePopulationChange}
          valueLabelDisplay="auto"
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
