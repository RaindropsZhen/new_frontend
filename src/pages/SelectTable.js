import React, { useState, useEffect, useContext } from 'react';
import { Row, Container, Card, Col } from 'react-bootstrap'; // Removed Button as StyledButton is removed
import { useParams } from 'react-router-dom'; // useHistory not needed
import { useTranslation } from 'react-i18next'; // Import useTranslation
import styled from 'styled-components';
import { fetchPlace } from '../apis';
import AuthContext from '../contexts/AuthContext'; // Import AuthContext

const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f8f9fa;
`;

// StyledSelect and StyledButton are no longer used, so they are removed.

const Heading = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: bold;
`;

const TableCard = styled(Card)`
  margin: 10px;
  width: 100px; // Adjust as needed
  height: 100px; // Adjust as needed
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #dee2e6;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }
`;

const TableNumberInput = () => {
  const [place, setPlace] = useState(null);
  const { id: placeId } = useParams(); 
  const auth = useContext(AuthContext);
  const { t } = useTranslation(); // Initialize useTranslation

  useEffect(() => {
    const loadPlaceData = async () => {
      if (placeId && auth.token) {
        const placeData = await fetchPlace(placeId, auth.token);
        if (placeData) {
          setPlace(placeData);
        }
      }
    };
    loadPlaceData();
  }, [placeId, auth.token]);

  const handleTableCardClick = (tableNumber) => {
    // The URL structure /menu/0/${placeId}/${tableNumber} seems a bit odd with the '0'.
    // Assuming this '0' is intentional or a placeholder for a 'code' that might be used later.
    // If it should be the placeId itself, this needs adjustment.
    // For now, sticking to the original URL structure provided in the old code.
    const newUrl = `/menu/0/${placeId}/${tableNumber}`; 
    window.open(newUrl, '_blank'); 
  };
  
  if (!place || !place.tables) {
    return (
      <StyledContainer>
        <Heading>Loading Tables...</Heading>
        {/* Add a spinner here if desired */}
      </StyledContainer>
    );
  }

  // Sort tables by table_number for consistent display
  const sortedTables = [...place.tables].sort((a, b) => a.table_number - b.table_number);

  return (
    <StyledContainer>
      <Heading>{t('selectTable.title', 'Select Table')}</Heading>
      <Row className="justify-content-center g-3"> {/* g-3 for gutter/spacing */}
        {sortedTables.map((table) => (
          <Col key={table.id} xs="auto"> {/* xs="auto" for natural width or specify Col size */}
            <TableCard onClick={() => handleTableCardClick(table.table_number)}>
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title className="mb-0">{table.table_number}</Card.Title>
              </Card.Body>
            </TableCard>
          </Col>
        ))}
        {/* Consider if "VIP" (table 77) needs special handling if not in place.tables */}
      </Row>
    </StyledContainer>
  );
};

export default TableNumberInput;
