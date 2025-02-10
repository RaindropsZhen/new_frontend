// src/components/DropdownTableNumberPicker.js

import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled.select`
  font-size: 1rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-color: #ffffff;
  color: #495057;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;
const DropdownTableNumberPicker = ({ initialValue, min, max, onChange }) => {
    const numberOptions = Array.from({ length: max - min + 1 }, (_, index) => min + index);

    return (
            <StyledSelect
                value={initialValue}
                onChange={(e) => onChange(parseInt(e.target.value))}
            >
                {numberOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </StyledSelect>
    );
};

export default DropdownTableNumberPicker;
