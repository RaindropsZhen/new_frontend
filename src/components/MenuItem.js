import { Col, Button } from 'react-bootstrap';
import React from 'react';
import styled from 'styled-components';
import { BiEdit } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';

const Container = styled.div`
  border-radius: 5px;
  background-color: white;
  margin-bottom: 30px;
  box-shadow: 1px 1px 8px rgba(0,0,0,0.1);
  display: flex;
  opacity: ${({active}) => (active ? 1 : 0.6)};
  > div:first-child {
    width: 40%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-size: cover;
  }
  > div:last-child {
    padding: 15px 20px;
    min-height: 150px;
  }
`;
const renderMenuItemName = (item,selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return item.name;
      case 'English':
      return item.name_en;
      case 'Español':
      return item.name_es;
      case 'Português':
      return item.name_pt;
    default:
      return item.name;
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
const MenuItem = ({ language,item, onEdit, onRemove, onOrder, color }) => (
  <Container active={item.is_available}>

    <Col xs={5} 
      style={{
        backgroundImage: `url(${item.image})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        maxWidth: '90%',
        maxHeight: '100%',
        margin: '10px 0',
    }} 
    />
    <Col xs={7}
      className="d-flex flex-column justify-content-between w-100"

      >
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="mb-0">
            <b>{item.name_to_print} {renderMenuItemName(item,language)}</b>
          </h4>
          <div>
            { onEdit ? (
              <Button variant="link" onClick={onEdit}>
                <BiEdit size={20} />
              </Button>
            ) : null }

            { onRemove ? (
              <Button variant="link" onClick={onRemove}>
                <AiOutlineDelete size={20} color="red" />
              </Button>
            ) : null }
          </div>
        </div>
        <p className="mb-4">{renderMenuItemDescription(item, language)}</p>
      </div>
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <h5 className="mb-0 text-standard">
            <b style={{ color }}>${item.price}</b>
          </h5>

          {onOrder ? (
            <Button 
              variant="standard" 
              style={{ backgroundColor: color }} 
              className="mt-2" 
              size="sm" 
              onClick={() => onOrder(item)}
            >
              {!item.quantity ? "Add to shopping cart" : `Add one more (${item.quantity})`}
            </Button>
          ) : null}
        </div>

        {!item.is_available ? (<small className="text-secondary">Not Available</small>) : null}

      </div>
    </Col>
  </Container>
);

export default MenuItem;