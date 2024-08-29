import React from 'react';
import styled from 'styled-components';
import MenuGrid from './MenuGrid'; 


const Container = styled.div`
  b, p {
    ${({ font }) => font && `font-family: ${font};`}
  }
`;

const MenuList = ({ selectedLanguage, place, shoppingCart = {}, onOrder, font = "", color = "", selectedCategoryName=""}) => {
  const renderCategoryName = (category) => {
    switch (selectedLanguage) {
      case '中文':
        return category.name;
      case 'English':
        return category.name_en;
      case 'Español':
        return category.name_es;
      case 'Português':
        return category.name_pt;
      default:
        return category.name;
    }
  };
  return (
    <Container font={font}>
      {place?.categories 
        ?.filter(
          (category) => category.menu_items.filter((i) => i.is_available).length
        )
        .filter((category) => !selectedCategoryName || renderCategoryName(category) === selectedCategoryName)
        .map((category) => (
          <div key={category.id} className="mt-5">
            <h4 className="mb-4">
              <b>{renderCategoryName(category)}</b>
            </h4>
            <MenuGrid 
              category={category} 
              selectedLanguage={selectedLanguage} 
              shoppingCart={shoppingCart} 
              onOrder={onOrder} 
              color={color} 
            />
          </div>
        ))
      }
    </Container>
  );
};

export default MenuList;
