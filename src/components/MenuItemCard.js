import { Row, Col, Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from 'styled-components'; // Import styled-components
import OperationButton from './OperationButton';

// Styled Components
const NamePriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align to top in case name wraps */
  width: 100%;
  margin-bottom: 8px; 
`;

const ItemName = styled.h5`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  margin-right: 8px; /* Space between name and price */
  flex-grow: 1; /* Allow name to take available space */
  /* text-overflow: ellipsis; // Keep if single line is desired */
  /* white-space: nowrap; // Keep if single line is desired */
  /* overflow: hidden; // Keep if single line is desired */
`;

const ItemPrice = styled.p`
  font-size: 0.95rem;
  font-weight: bold;
  color: ${props => props.color || '#007bff'};
  margin-bottom: 0;
  text-align: right;
  white-space: nowrap; /* Price usually doesn't wrap */
  flex-shrink: 0; /* Prevent price from shrinking */
`;

const CardBodyStyled = styled(Card.Body)`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between; 
`;

// ItemInfo and ContentRow might not be needed with the new structure, or ItemInfo can be repurposed.
// For now, removing ItemInfo and ContentRow definitions if they are fully replaced by NamePriceRow logic.
// const ItemInfo = styled.div` ... `; // Removed/Replaced
// const ContentRow = styled.div` ... `; // Removed/Replaced

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: auto; /* Pushes buttons to the bottom of CardBodyStyled if it's a flex column */
  padding-top: 5px; /* Space above buttons if they are at the bottom */
  justify-content: flex-end; /* Align buttons to the right */
  width: 100%; /* Ensure it takes full width for justify-content to work */
`;

const renderMenuItemDescriptionModalName = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return '介绍';
    case 'English':
      return 'Description';
    case 'Português':
      return 'Descrição';
    default:
      return '介绍';
  }
};

const renderAvailabilityDinner = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return '晚餐可点';
    case 'English':
      return 'Only available in dinner';
    case 'Português':
      return 'Disponível apenas no jantar';
    default:
      return 'Only available in dinner';
  }
};

const renderMenuItemName = (item, selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return item.name;
    case 'English':
      return item.name_en;
    case 'Português':
      return item.name_pt;
    default:
      return item.name_en;
  }
};

const renderMenuItemDescription = (item, selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return item.description;
    case 'English':
      return item.description_en;
    case 'Português':
      return item.description_pt;
    default:
      return item.description;
  }
};

const MenuItemCard = ({ language, item, onOrder, onRemove, color }) => {

  const [showDescription, setShowDescription] = useState(false);
  const handleShow = () => setShowDescription(true);
  const handleClose = () => setShowDescription(false);

  const date = new Date();
  const lisbonTime = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
  const hour = lisbonTime.getHours();
  const minute = lisbonTime.getMinutes();
  const second = lisbonTime.getSeconds();
  const currentTimeSeconds = 3600 * hour + 60 * minute + second;

  const [currentOrderingTiming, setCurrentOrderingTiming] = useState('');
  const [currentAvailability, setCurrentAvailability] = useState(false);
  
  useEffect(() => {
    const currentDay = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  
    if (item.lunch_time_start <= currentTimeSeconds && currentTimeSeconds <= item.lunch_time_end) {
      setCurrentOrderingTiming('lunch');
    } else if (item.dinne_time_start <= currentTimeSeconds && currentTimeSeconds <= item.dinne_time_end) {
      setCurrentOrderingTiming('dinner');
    } else {
      setCurrentOrderingTiming('closes');
    }
  
    if (item.ordering_timing === "lunch_and_dinner") {
      setCurrentAvailability(true);
    } else {
      const is_available = item.ordering_timing === currentOrderingTiming;
  
      // Check if the current day is Saturday (6) or Sunday (0)
      if (currentDay === 0 || currentDay === 6) {
        setCurrentAvailability(true);
      } else {
        setCurrentAvailability(is_available);
      }
    }
  }, [item, currentTimeSeconds, currentOrderingTiming]);

  
  return (
    <>
      <Card className='card' style={{ borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <LazyLoadImage
          src={item.image}
          alt={renderMenuItemName(item, language)}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '150px', // Adjusted image height
            filter: currentAvailability ? '' : 'grayscale(80%)',
            cursor: currentAvailability && (item.description || item.description_en || item.description_pt) ? 'pointer' : 'default'
          }}
          onClick={currentAvailability && (item.description || item.description_en || item.description_pt) ? handleShow : undefined}
        />
        <CardBodyStyled>
          <div> {/* Wrapper for top content: Name/Price and optional Description */}
            <NamePriceRow>
              <ItemName title={renderMenuItemName(item, language)}>
                {item.code && <span className="red-text" style={{ marginRight: '5px', fontWeight: 'normal' }}>{item.code}</span>}
                {renderMenuItemName(item, language)}
              </ItemName>
              {item.price > 0 && <ItemPrice color={color}>{item.price}€</ItemPrice>}
            </NamePriceRow>
            {/* 
            // Optional: Description can be added here if desired
            // {(item.description || item.description_en || item.description_pt) && (
            //   <ItemDescriptionText style={{fontSize: '0.75rem', color: '#6c757d', marginTop: '4px'}}>
            //     {renderMenuItemDescription(item, language)}
            //   </ItemDescriptionText>
            // )}
            */}
          </div>
          
          {onOrder && (
            <ActionButtons>
              <OperationButton
                variant="lightgray"
                size="sm"
                onClick={() => onRemove(item)}
                disabled={!currentAvailability || (item.quantity || 0) === 0}
              >
                -
              </OperationButton>
              <span style={{ margin: '0 8px', minWidth: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
                {item.quantity >= 0 ? item.quantity : 0}
              </span>
              <OperationButton
                variant="lightgray"
                size="sm"
                onClick={() => onOrder(item)}
                disabled={!currentAvailability}
              >
                +
              </OperationButton>
            </ActionButtons>
          )}
        </CardBodyStyled>
        
        {/* Availability note */}
        {!currentAvailability && item.ordering_timing === 'dinner' && (
          <div style={{ padding: '5px 10px', textAlign: 'center', backgroundColor: '#f8f9fa', borderTop: '1px solid #eee' }}>
            <small className="text-secondary" style={{fontSize: '0.7rem'}}>
              {renderAvailabilityDinner(language)}
            </small>
          </div>
        )}
      </Card>

      {/* Modal for description */}
      {(item.description || item.description_en || item.description_pt) && (
        <Modal show={showDescription} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{renderMenuItemDescriptionModalName(language)}</Modal.Title>
          </Modal.Header>
          <LazyLoadImage
            src={item.image}
            alt={renderMenuItemName(item, language)}
            style={{ width: '100%', height: 'auto' }}
          />
          <Modal.Body>{renderMenuItemDescription(item, language)}</Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default MenuItemCard;
