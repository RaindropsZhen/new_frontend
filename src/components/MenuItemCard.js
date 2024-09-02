import { Row, Button,Col, Modal  } from 'react-bootstrap';
import React, { useState, useEffect  } from 'react';
import Card from 'react-bootstrap/Card';
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FaPlus } from "react-icons/fa";

const renderMenuItemDescriptionModalName = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return '介绍';
    case 'English':
      return 'Description';
    case 'Español':
      return 'Descripción';
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
    case 'Español':
      return 'Solo disponible en la cena';
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
    case 'Español':
      return 'Solo disponible en el almuerzo';
    case 'Português':
      return 'Disponível apenas no almoço';
    default:
      return 'Only available in lunch';
  }
};


const renderMenuItemName = (item,selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return item.name_cn;
    case 'English':
      return item.name_en;
    case 'Español':
      return item.name_es;
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
      case 'Español':
      return item.description_es;
      case 'Português':
      return item.description_pt;
    default:
      return item.description; 
  }
};

const MenuItemCard = ({ language,item, onOrder, color }) => {

  const [showDescription, setShowDescription] = useState(false);
  const handleShow = () => setShowDescription(true);
  const handleClose = () => setShowDescription(false);
  const date = new Date()
  const lisbonTime = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));

  const hour = lisbonTime.getHours();
  const minute = lisbonTime.getMinutes();
  const second = lisbonTime.getSeconds();
  const currentTimeSeconds = 3600 * hour + 60 * minute + second;
  const [currentOrderingTiming, setCurrentOrderingTiming] = useState('');
  const [currentAvailability, setCurrentAvailability] = useState(false);

  useEffect(() => {
    // Check if it's lunchtime
    if (item.lunch_time_start <= currentTimeSeconds && currentTimeSeconds <= item.lunch_time_end) {
      setCurrentOrderingTiming('lunch');
    }
    // Check if it's dinnertime
    else if (item.dinne_time_start <= currentTimeSeconds && currentTimeSeconds <= item.dinne_time_end) {
      setCurrentOrderingTiming('dinner');
    }
    // If it's neither lunchtime nor dinnertime
    else {
      setCurrentOrderingTiming('closes');
    }

    // Check if item.ordering_timing is "lunch_and_dinner"
    if (item.ordering_timing === "lunch_and_dinner") {
      setCurrentAvailability(true);
    } else {
      // Check if item.ordering_timing matches currentOrderingTiming
      const is_available = item.ordering_timing === currentOrderingTiming;

      // Set current_availability based on the check
      setCurrentAvailability(is_available);
    }

  }, [item, currentTimeSeconds, currentOrderingTiming]); // Add dependencies here, e.g., item, currentTimeSeconds, etc.

  return (
  <>
      <Card className='card'>
          {/* <Card.Img 
            variant="top"
            src={item.image}
            style={{
              objectFit: 'contain', 
              width: '100%', 
              height: '40%', 
              filter: currentAvailability ? '' : 'grayscale(50%)'
            }}
            onClick={currentAvailability ? handleShow : undefined}
          /> */}
          {/* <LazyLoadImage 
              variant="top"
              src={item.image}
              style={{
                  objectFit: 'contain', 
                  width: '100%', 
                  height: '40%', 
                  filter: currentAvailability ? '' : 'grayscale(50%)'
              }}
              onClick={currentAvailability ? handleShow : undefined}
          /> */}
          <Card.Body>
              <Card.Title style={{ fontSize: '16px' }}>{item.code}. {renderMenuItemName(item,language)}</Card.Title>
              <Card.Text>
                <Col>
                  <Modal show={showDescription} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>{renderMenuItemDescriptionModalName(language)}</Modal.Title>
                    </Modal.Header>
                    {/* <img src={item.image} alt={item.name} style={{ width: '100%', height: 'auto'}} /> / */}
                    <LazyLoadImage 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '100%', height: 'auto'}}
                    />
                    <Modal.Body>{renderMenuItemDescription(item, language)}</Modal.Body>
                  </Modal>
                  <Row className="justify-content-between">
                      <b style={{ color }}>{item.price}€</b>
                      {onOrder ? (
                        <Button 
                          style={{ 
                            backgroundColor: "#FE6C4C", 
                            borderRadius: "50%", 
                            width: "2.5em", 
                            height: "2.5em", 
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                          disabled={!currentAvailability}
                          className="mt-2" 
                          size="sm" 
                          onClick={() => onOrder(item)}
                        >
                        {!item.quantity ? 
                          <FaPlus className='plus-icon' style={{ color: "white",fontSize: "1.5em" }}/> : <FaPlus className='plus-icon' style={{ color: "white",fontSize: "1.5em" }}/>} {item.quantity}
                        </Button>
                      ) : null}
                  </Row>
                </Col>
              </Card.Text>
          </Card.Body>
      </Card>

      <Row xs={7}
        className="d-flex flex-column justify-content-between w-100"
        >
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <h5 className="mb-0 text-standard">
            </h5>
          </div>

          <div>
          <p>
            {!currentAvailability && (
              <small className="text-secondary">
                {item.ordering_timing === 'lunch' ? renderAvailabilityDinner(language) : renderAvailabilityLunch(language)}
              </small>
            )}
          </p>

          </div>
        </div>
      </Row>
  </>

)
};

export default MenuItemCard;