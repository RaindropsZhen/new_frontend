import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MenuItemCard from './MenuItemCard'; 

const MenuGrid = ({ category, selectedLanguage, shoppingCart, onOrder, color }) => {
  const items = category.menu_items.filter((item) => item.is_available);
return (
    <Row xs={3} md={6}>
    {items.map((item, index) => (
        <Col key={index}>
          <MenuItemCard 
              language={selectedLanguage}
              item={{  
              ...item,
              quantity: shoppingCart[item.id]?.quantity,
              }} 
              onOrder={onOrder}
              color={color}
          />
        </Col>
    ))}
    </Row>

  );
};

export default MenuGrid;
