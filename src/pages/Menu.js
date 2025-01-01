import { Container, Row, Col, Button } from 'react-bootstrap';
import { IoCloseOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { fetchPlace } from '../apis';
import styled from 'styled-components';

import LanguageSelectionModal from '../components/LanguageSelectionModal';

import MenuList from '../components/MenuList';
import ShoppingCart from '../components/ShoppingCart';

const languages = [
  {value: "en","label":"English"},
  {value:"pt","label":"Português"},
  { value: 'cn', "label": '中文' }
];

const StickyFilterContainer = styled.div`
  position: sticky;
  top: 0; // Adjust this value as needed
  z-index: 1020; // Ensures it's above other content
  padding: 10px 20px; // Optional padding for better spacing
  background-color: #fff; // Use an appropriate background color
`;
 
  const renderFilterAllButton = (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return '全部';
      case 'English':
        return 'All';
      case 'Português':
        return 'Tudo';
      default:
        return '全部';
    }
  };
const OrderButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  box-shadow: 1px 1px 8px rgba(0,0,0,0.2);
  width: 60px;
  height: 60px;
`;
const Menu = () => {

  const [place, setPlace] = useState({});
  const [shoppingCart, setShoppingCart] = useState({});
  const [showShoppingCart, setShowShoppingCart] = useState(false);

  const params = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [LastOrderingTiming, setLastOrderingTiming] =useState("");

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false); 
    localStorage.setItem('selectedLanguage', selectedLanguage);
  };


  const onFetchPlace = async () => {
    try {
      const json = await fetchPlace(params.id);
      if (json) {
        setPlace(json);
      }
    
    } catch (error) {
      console.error('Error fetching place:', error);
    }
  };
  const onAddItemtoShoppingCart = (item) => {
    setShoppingCart({
      ...shoppingCart,
      [item.id]: {
        ...item,
        quantity: (shoppingCart[item.id]?.quantity || 0) + 1,
      }
    });
  }


  const onRemoveItemToShoppingCart = (item) => {
    if (totalQuantity === 1) {
      setShowShoppingCart(false);
    }

    setShoppingCart({
      ...shoppingCart,
      [item.id]: {
        ...item,
        quantity: (shoppingCart[item.id]?.quantity || 0) - 1,
      }
    });
  }
  const totalQuantity = useMemo(
    () => Object.keys(shoppingCart)
            .map((i) => shoppingCart[i].quantity)
            .reduce((a,b) => a + b, 0),
      [shoppingCart]
  );

  useEffect(() => {
    onFetchPlace();
    
    if (place && place.tables && params && params.table) {
      const tableNumber = parseInt(params.table); // Convert params.table to integer
      // Find the table with table_number equal to 2
      const table = place.tables.find(table => {
        return parseInt(table.table_number) === tableNumber;
      });
      if (table) {
        // Set the last ordering timing if the table is found
        setLastOrderingTiming(table.last_ordering_time);
      } 
    }

  }, [place, params.table]);

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
  const categories = place && place.categories ? place.categories.map(
    (category) => renderCategoryName(category)
  ) : [];

  const [selectedCategoryName, setSelectedCategoryName] = useState(categories.length > 0 ? categories[0] : '');


  const handleCategoryClick = (name) => {
    setSelectedCategoryName(name);
  };

  return (
    <Container fluid className="mt-2 mb-4">
      {/* Filter */}
      <StickyFilterContainer >
        <Row className="d-flex justify-content-between align-items-center flex-nowrap gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategoryName}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="custom-dropdown"
          >
            <option value="">{renderFilterAllButton(selectedLanguage)}</option>
            {categories?.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {/* Language Dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageSelect(e.target.value)}
            className="custom-dropdown"
          >
            {languages.map((language) => (
              <option key={language.label} value={language.label}>
                {language.label}
              </option>
            ))}
          </select>
        </Row>
      </StickyFilterContainer>




      <Row className="justify-content-center m-2">
        {showLanguageModal && (
          <LanguageSelectionModal
            show={showLanguageModal}
            onHide={() => setShowLanguageModal(false)}
            languages={languages}
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
          />
        )}
        <Col lg={8}>
        {showShoppingCart ? (
            <ShoppingCart
              items={Object.keys(shoppingCart)
                .map((key) => shoppingCart[key])
                .filter((item) => item.quantity > 0)
              }
              selectedLanguage={selectedLanguage}
              onAdd={onAddItemtoShoppingCart}
              onRemove={onRemoveItemToShoppingCart}
              color={place.color}
              table_id={params.table}
              last_ordering_timing={LastOrderingTiming}
              orderingInterval = {place.ordering_limit_interval}
            />
          ) : (
            <MenuList 
              selectedLanguage={selectedLanguage}
              place={place} 
              shoppingCart={shoppingCart} 
              onOrder={onAddItemtoShoppingCart}
              onRemove={onRemoveItemToShoppingCart}
              color={place.color} 
              font={place.font}
              selectedCategoryName={selectedCategoryName}
            />
          )}
        </Col>
      </Row>
      {totalQuantity ? (
        <OrderButton 
          variant="standard"
          style={{
             backgroundColor: '#FE6C4C'
            //  place.color 
            }} 
          onClick={() => setShowShoppingCart(!showShoppingCart)}>
          {showShoppingCart ? <IoCloseOutline size={25} /> : totalQuantity}
        </OrderButton>
      ) : null}
  </Container>
  )
};

export default Menu;