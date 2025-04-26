import React from 'react';
import { TextField, Button, Stack } from '@mui/material';

const SearchBar = ({ userId, setUserId, onSearch }) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <TextField
        label="Search by User ID"
        type="number"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Button variant="contained" onClick={onSearch}>
        Search
      </Button>
    </Stack>
  );
};

export default SearchBar;
