import React, { useState } from 'react';
import { Button, Row, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f8f9fa;
`;

const StyledSelect = styled.select`
  font-size: 1.5rem;
  height: 4rem;
  width: 6rem;
  padding: 0.5rem;
  border: 2px solid #007bff;
  border-radius: 5px;
  background-color: #ffffff;
  color: #333;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const StyledButton = styled(Button)`
  height: 3.5rem;
  width: 14rem;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #003d80;
    transform: translateY(1px);
  }
`;

const Heading = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: bold;
`;

const TableNumberInput = () => {
  const [tableNumber, setTableNumber] = useState(1);
  const numberOptions = [...Array(76).keys()].map((num) => num + 1).concat("VIP"); // Generate 1-76 and 'VIP'
  const { id } = useParams(); // Access the id parameter from the URL

  const handleTableSubmit = () => {
    const tableValue = tableNumber === "VIP" ? 77 : tableNumber; // Treat "VIP" as 77
    const newUrl = `/menu/0/${id}/${tableValue}`; // Construct the URL
    window.open(newUrl, '_blank'); // Open the URL in a new tab
  };
  
  return (
    <StyledContainer>
      <Heading>Select Table</Heading>
      <Row className="justify-content-center mb-3">
        <StyledSelect
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        >
          {numberOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </StyledSelect>
      </Row>
      <Row className="justify-content-center">
        <StyledButton onClick={handleTableSubmit}>Submit / Submeter</StyledButton>
      </Row>
    </StyledContainer>
  );
};

export default TableNumberInput;
