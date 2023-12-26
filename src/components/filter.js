import React from 'react';
import Select from 'react-select';

const Filter = ({ selectedOptions, setSelectedOptions, options, label }) => {
  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <div className="filter-container">
      <label>{label}:</label>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
      />
    </div>
  );
};

export default Filter;
