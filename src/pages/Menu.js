import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { IoCloseOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { fetchPlace } from '../apis';
import styled from 'styled-components';

import LanguageSelectionModal from '../components/LanguageSelectionModal';

import MenuList from '../components/MenuList';
import ShoppingCart from '../components/ShoppingCart';
import { useTranslation } from 'react-i18next';
const languages = [
  {value: "en","label":"English"},
  {value:"pt","label":"Português"},
  {value:"es","label":"Español"},
  { value: 'cn', "label": '中文' }
];

const StickyFilterContainer = styled.div`
  position: sticky;
  top: 0; // Adjust this value as needed
  z-index: 1020; // Ensures it's above other content
  padding: 10px 20px; // Optional padding for better spacing
  background-color: #fff; // Use an appropriate background color
`;
  // .row {
  //   flex-wrap: nowrap !important; // Add this line to ensure flex items don't wrap
  // }
const GlobeIcon = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="currentColor"
    className="bi bi-globe"
    viewBox="0 0 16 16"
  >
    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
  </svg>
)
  const renderFilterAllButton = (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return '全部';
      case 'English':
        return 'All';
      case 'Español':
        return 'Todo';
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

  const { t } = useTranslation()
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
        <Row className="d-flex justify-content-between align-items-center">
        <select
          value={selectedCategoryName}
          onChange={(e) => handleCategoryClick(e.target.value)}
          className="form-select mx-2 btn-lg with-border"
          style={{
            backgroundColor: '#FE6C4C',
            color: 'white',
          }}
        >
          <option value="">{renderFilterAllButton(selectedLanguage)}</option>
          {categories?.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageSelect(e.target.value)}
          className="form-select mx-2 btn-lg with-border"
          style={{ backgroundColor: '#FE6C4C', color: 'white' }}
        >
          {languages.map((language) => (
            <option
              key={language.label}
              value={language.label}
              style={{ backgroundColor: '#FE6C4C', color: 'white' }}
            >
              {language.label}
            </option>
          ))}
        </select>

      </Row>
        </StickyFilterContainer>
          {/* Language Selection */}
        <Row className="justify-content-end">
      </Row>

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