import React from "react";

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    Filter: <input value={filter} onChange={handleFilterChange} />
  </div>
);

export default Filter;