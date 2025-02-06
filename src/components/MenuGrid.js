import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MenuItemCard from './MenuItemCard'; 

const MenuGrid = ({ category, selectedLanguage, shoppingCart, onOrder, onRemove, color }) => {
  const items = category.menu_items.filter((item) => item.is_available);
return (
// Modify the Row and Col to display 2 items per row on larger screens
<Row xs={2} sm={2} md={2} lg={2} xl={2} className="g-4 justify-content-center">
  {items.map((item, index) => (
    <Col key={index} className="custom-col" style={{ width: '50%' }}>
      <MenuItemCard
        language={selectedLanguage}
        item={{
          ...item,
          quantity: shoppingCart[item.id]?.quantity,
        }}
        onOrder={onOrder}
        onRemove={onRemove}
        color={color}
      />
    </Col>
  ))}
</Row>



  );
};

export default MenuGrid;
