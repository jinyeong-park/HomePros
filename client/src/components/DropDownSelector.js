import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const DropDownSelector = ({ options, onSelect, defaultValue }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue || '');

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
  };

  return (
    <FormControl>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={selectedOption}
        onChange={handleSelectChange}
        label={`${selectedOption}`}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropDownSelector;
