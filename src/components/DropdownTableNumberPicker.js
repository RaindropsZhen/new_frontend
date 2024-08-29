// src/components/DropdownTableNumberPicker.js

import React from 'react';

const DropdownTableNumberPicker = ({ initialValue, min, max, onChange }) => {
  const numberOptions = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  return (
    <div>
      <select
        value={initialValue}
        onChange={(e) => onChange(parseInt(e.target.value))}
      >
        {numberOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownTableNumberPicker;
