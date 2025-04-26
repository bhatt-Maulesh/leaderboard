import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Filter = ({ filterType, setFilterType }) => {
  return (
    <FormControl sx={{ mt: 2, minWidth: 120 }}>
      <InputLabel>Filter</InputLabel>
      <Select
        value={filterType}
        label="Filter"
        onChange={(e) => setFilterType(e.target.value)}
      >
        <MenuItem value="day">Today</MenuItem>
        <MenuItem value="month">This Month</MenuItem>
        <MenuItem value="year">This Year</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Filter;
