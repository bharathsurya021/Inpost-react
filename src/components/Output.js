// src/components/Output.js
import React from 'react';

const Output = ({ data }) => {
  return (
    <div>
      <textarea
        id="output"
        rows="10"
        cols="60"
        value={data.length === 0 ? 'No data' : JSON.stringify(data, null, 2)}
        readOnly
      ></textarea>
    </div>
  );
};

export default Output;
