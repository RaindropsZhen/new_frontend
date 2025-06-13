import { Row, Col, Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { LazyLoadImage } from "react-lazy-load-image-component";
import OperationButton from './OperationButton';

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
  const currentTimeSeconds = 3600 * hour + 60 * minute;

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
      <Card className='card h-100' style={{ borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <LazyLoadImage
          src={item.image}
          alt={renderMenuItemName(item, language)}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '180px', // Slightly reduced height for more text space
            filter: currentAvailability ? '' : 'grayscale(80%)'
          }}
          onClick={currentAvailability ? handleShow : undefined}
        />
        <Card.Body style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
          {/* Top part for name, code, and price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
            <Card.Title style={{ fontSize: '1em', fontWeight: 'bold', color: '#333', flexGrow: 1, marginRight: '5px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.8em', color: '#777', marginRight: '5px' }}>{item.code}</span>
              {renderMenuItemName(item, language)}
            </Card.Title>
            {item.price > 0 && (
              <b style={{ color: color || '#FE6C4C', fontSize: '1.1em', fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '5px' }}>
                {item.price.toFixed(2)}€
              </b>
            )}
          </div>

          {/* Bottom part for buttons only */}
          {onOrder && (
            <div style={{ marginTop: '10px' }}>
              <div className="d-flex justify-content-end align-items-center">
                <OperationButton
                  variant="lightgray"
                  size="sm"
                  onClick={() => onRemove(item)}
                  disabled={!currentAvailability || (item.quantity || 0) === 0}
                  style={{ padding: '0.2rem 0.5rem', minWidth: '30px' }}
                >
                  -
                </OperationButton>
                <span style={{ margin: '0 8px', fontSize: '1em', color: '#333' }}>
                  {item.quantity >= 0 ? item.quantity : 0}
                </span>
                <OperationButton
                  variant="lightgray"
                  size="sm"
                  onClick={() => onOrder(item)}
                  disabled={!currentAvailability}
                  style={{ padding: '0.2rem 0.5rem', minWidth: '30px' }}
                >
                  +
                </OperationButton>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDescription} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{renderMenuItemDescriptionModalName(language)}</Modal.Title>
        </Modal.Header>
        <LazyLoadImage
          src={item.image}
          alt={renderMenuItemName(item, language)}
          style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
        />
        <Modal.Body>{renderMenuItemDescription(item, language)}</Modal.Body>
      </Modal>

      {/* This Row seems out of place and might be redundant or for a different layout. Reviewing its necessity. */}
      <Row xs={7} className="d-flex flex-column justify-content-between w-100" style={{ marginTop: '5px' }}>
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <h5 className="mb-0 text-standard">
            </h5>
          </div>

          <div>
            <p>
              {!currentAvailability && item.ordering_timing === 'dinner' && (
                <small className="text-secondary">
                  {renderAvailabilityDinner(language)}
                </small>
              )}
            </p>
          </div>
        </div>
      </Row>
    </>
  );
};

export default MenuItemCard;
