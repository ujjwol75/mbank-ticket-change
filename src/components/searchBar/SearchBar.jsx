import { Box, IconButton, InputBase } from '@mui/material';
import React, { useState } from 'react';
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery); 
      setSearchQuery(""); 
    }
  };

  return (
    <Box display="flex" backgroundColor='#f6f6f6' borderRadius="3px">
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        placeholder="Search by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <IconButton type="button" sx={{ p: 1 }} onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
