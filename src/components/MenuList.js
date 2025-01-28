import React from 'react';
import styled from 'styled-components';
import MenuGrid from './MenuGrid'; 

const Container = styled.div`
  b, p {
    ${({ font }) => font && `font-family: ${font};`}
  }
`;

const CategoryHeader = styled.h4`
  font-size: 1.8em;
  font-weight: bold;
  text-align: center;
  color: ${({ color }) => color || '#333'};
  margin: 20px 0;
  padding: 10px;
  background-color: ${({ bgColor }) => bgColor || '#f8f9fa'};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px; /* Add spacing between categories */
`;

const MenuList = ({ 
  selectedLanguage, 
  place, 
  shoppingCart = {}, 
  onOrder, 
  onRemove,
  font = "", //remove later
  color = "", //remove later
  selectedCategoryName=""
}) => {
  const renderCategoryName = (category) => {
    switch (selectedLanguage) {
      case '中文':
        return category.name_cn;
      case 'English':
        return category.name_en;
      case 'Português':
        return category.name_pt;
      default:
        return category.name;
    }
  };

  return (
    <Container 
      font={font} //remove later
    >
      {place?.categories 
        ?.filter(
          (category) => category.menu_items.filter((i) => i.is_available).length
        )
        .filter((category) => !selectedCategoryName || renderCategoryName(category) === selectedCategoryName)
        .map((category, index) => (
          <CategoryWrapper key={index}>
            <CategoryHeader color={color}>
              {renderCategoryName(category)}
            </CategoryHeader>
            <MenuGrid 
              category={category} 
              selectedLanguage={selectedLanguage} 
              shoppingCart={shoppingCart} 
              onOrder={onOrder} 
              onRemove = {onRemove}
              color={color} 
            />
          </CategoryWrapper>
        ))
      }
    </Container>
  );
};

export default MenuList;
