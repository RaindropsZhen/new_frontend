import { Row, Button, Col, Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaPlus } from "react-icons/fa";

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

const renderAvailabilityLunch = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return ' 午餐可点';
    case 'English':
      return 'Only available in lunch';
    case 'Português':
      return 'Disponível apenas no almoço';
    default:
      return 'Only available in lunch';
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

const MenuItemCard = ({ language, item, onOrder, color }) => {

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
      setCurrentAvailability(is_available);
    }
  }, [item, currentTimeSeconds, currentOrderingTiming]);

  return (
    <>
      <Card className='card' style={{ borderRadius: '10px', overflow: 'hidden' }}>
  <LazyLoadImage
    src={item.image}
    alt={item.name}
    style={{
      objectFit: 'cover',
      width: '100%',
      height: '200px',
      filter: currentAvailability ? '' : 'grayscale(50%)'
    }}
    onClick={currentAvailability ? handleShow : undefined}
  />
  <Card.Body style={{ padding: '5px' }}>
    <Card.Title style={{ fontSize: '14px' }}>
      <span className="red-text">{item.code}</span>{renderMenuItemName(item, language)}
    </Card.Title>
    <Card.Text>
      <Col>
        <Modal show={showDescription} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{renderMenuItemDescriptionModalName(language)}</Modal.Title>
          </Modal.Header>
          <LazyLoadImage
            src={item.image}
            alt={item.name}
            style={{ width: '100%', height: 'auto' }}
          />
          <Modal.Body>{renderMenuItemDescription(item, language)}</Modal.Body>
        </Modal>
        <Row className="d-flex justify-content-between align-items-center">
          {/* Conditionally hide the price if it's 0 */}
          {item.price > 0 && <b style={{ color }}>{item.price}€</b>}
          {onOrder ? (
            <Button
              style={{
                backgroundColor: "#FE6C4C",
                borderRadius: "50%",
                width: "2em",
                height: "2em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              disabled={!currentAvailability}
              className="mt-2 ml-auto" // This pushes the button to the right
              size="sm"
              onClick={() => onOrder(item)}
            >
              <FaPlus className='plus-icon' style={{ color: "white", fontSize: "1.5em" }} /> {item.quantity}
            </Button>
          ) : null}
        </Row>
      </Col>
    </Card.Text>
  </Card.Body>
</Card>


      <Row xs={7} className="d-flex flex-column justify-content-between w-100">
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
