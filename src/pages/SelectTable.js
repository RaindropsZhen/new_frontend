import React, { useState } from 'react';
import { Button, Row, Container } from 'react-bootstrap';
import { useHistory,useParams  } from 'react-router-dom';

const TableNumberInput = () => {
  const [tableNumber, setTableNumber] = useState(1);
  const history = useHistory();
  const numberOptions = Array.from({ length: 100 }, (_, index) => index + 1);
  const { id } = useParams(); // Access the id parameter from the URL

  // const handleTableSubmit = () => {
  //   history.push(`/menu/6/${tableNumber}`);
  // }
  const handleTableSubmit = () => {
    history.push(`/menu/0/${id}/${tableNumber}`); // Use id from URL parameter
  }

  const handleNumberChange = (value) => {
    setTableNumber(value);
  }

  return (
    <Container style={{ height: '100vh', textAlign: 'center' }}>
      <Row className="h-20 justify-content-center mb-5 mt-5">
        <h4>Welcome to Our Restaurant😊!</h4>
        <h4>Bem Vindo 😊!</h4>
      </Row>
      <Row className="h-20 justify-content-center mb-5 mt-5">
        <h4>Please enter your table number to start ordering!</h4>
        <h4>Insira o número da sua mesa para fazer o pedido!</h4>
      </Row>
      <Row className="justify-content-center mb-5">
        <select
          value={tableNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          style={{
            fontSize: '2rem',
            height: '5rem',
            width: '5rem',
            padding: '0.5rem'
          }}
        >
          {numberOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Row>
      <Row className="justify-content-center mb-5">
        <Button
          variant="primary"
          type="submit"
          style={{
            height: '3rem',
            width: '12rem',
            fontSize: '1.2rem',
            backgroundColor: '#007BFF', // Add a background color
            border: 'none', // Remove the default button border
            borderRadius: '0.3rem', // Add some border radius
            cursor: 'pointer', // Change cursor on hover
          }}
          onClick={() => handleTableSubmit(tableNumber)}
        >
          Submit/Submeter
        </Button>
      </Row>
    </Container>
  );
}

export default TableNumberInput;
