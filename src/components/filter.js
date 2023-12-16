import React from 'react';
import Select from 'react-select';

const Filter = ({ selectedOptions, setSelectedOptions }) => {
  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };
  const options = [
    { value: 'posts', label: 'Posts' },
    { value: 'latest', label: 'Latest' },
    { value: 'jobposts', label: 'Job Posts' },
  ];
  return (
    <div className="filter-container">
      <label>Filter Options:</label>
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
