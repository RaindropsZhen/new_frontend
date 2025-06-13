// eslint-disable-next-line
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation here
import { fetchPlace } from '../apis';
import styled from 'styled-components';
import 'react-tabs/style/react-tabs.css';

import BottomTabBar from '../components/BottomTabBar';

import LanguageSelectionModal from '../components/LanguageSelectionModal';

import MenuList from '../components/MenuList';
import ShoppingCart from '../components/ShoppingCart';

const languages = [
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: 'cn', label: '中文' }
];
const takeawayBoxFee = 8.9
const StickyFilterContainer = styled.div`
  position: sticky;
  top: 0; // Adjust this value as needed
  z-index: 1020; // Ensures it's above other content
  padding: 10px 20px; // Optional padding for better spacing
  background-color: #f8f9fa; // Use an appropriate background color
`;

const renderFilterAllButton = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return '全部';
    case 'English':
      return 'Filter';
    case 'Português':
      return 'Tudo';
    default:
      return '全部';
  }
};
const Menu = () => {
  const { table } = useParams();
  const { t } = useTranslation(); // Correctly initialize t here
  // const [showAgreementModal, setShowAgreementModal] = useState(false); // Removed for agreement modal
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [place, setPlace] = useState({});
  const [shoppingCart, setShoppingCart] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [showShoppingCart, setShowShoppingCart] = useState(false);
  const params = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  // const [nextOrderingTime, setNextOrderingTime] = useState(0); // Removed for 10-min limit
  const [enableOrdering, setEnableOrdering] = useState(true); // Default to true, limit logic removed
  // const [timeLeftToOrder, setTimeLeftToOrder] = useState(0); // Removed for 10-min limit
  // const takeawayBoxFee = 8.9; // Removed for agreement modal

  // Removed agreementText, agreementTitle, agreeButtonText states

    useEffect(() => {
    const storedOrderHistory = localStorage.getItem(`orderHistory-${params.table}`);
    const storedTimestamp = localStorage.getItem(`orderHistoryTimestamp-${params.table}`);

    if (storedOrderHistory && storedTimestamp) {
      const now = Date.now();
      const timestamp = parseInt(storedTimestamp, 10);
      if (now - timestamp < 4 * 60 * 60 * 1000) { // 4 hours in milliseconds
        setOrderHistory(JSON.parse(storedOrderHistory));
      } else {
        localStorage.removeItem(`orderHistory-${params.table}`);
        localStorage.removeItem(`orderHistoryTimestamp-${params.table}`);
      }
    }
  }, [params.table]);

  useEffect(() => {
    if (orderHistory.length > 0) {
      localStorage.setItem(`orderHistory-${params.table}`, JSON.stringify(orderHistory));
      localStorage.setItem(`orderHistoryTimestamp-${params.table}`, Date.now().toString()); // Store as string
    }
  }, [orderHistory, params.table]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageModal(false); // Hide language modal after selection
    localStorage.setItem('selectedLanguage', language);
    // setShowAgreementModal(true); // Removed: Don't show agreement modal after language selection
};

const location = useLocation();
  const pathParts = location.pathname.split('/');
  const isTakeAway = pathParts[pathParts.length - 1].includes('takeaway');

  const onFetchPlace = useCallback(async () => {
    try {
      const json = await fetchPlace(params.id);
      if (json) {
        setPlace(json);
      }
    } catch (error) {
      console.error('Error fetching place:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetch
    }
  }, [params.id]);

  const onAddItemtoShoppingCart = (item) => {
    const tableNumber = parseInt(params.table);
    const currentTable = place.tables.find(
      (table) => parseInt(table.table_number) === tableNumber
    );
    const numberOfPeople = currentTable ? currentTable.number_people : 1; // Default to 1 if not found
    const allowedItems = 10
    const maxAllowedItems = numberOfPeople * allowedItems;

    const renderToastMessage = (language, maxItems) => {
      switch (language) {
        case '中文':
          return (
            <>
              每人每次最多可点 {allowedItems} 个菜品。<br />
              您最多可以订购 {maxItems} 个菜品。
            </>
          );
        case 'Português':
          return (
            <>
              Cada pessoa pode pedir {allowedItems} itens de cada vez. <br />
              Podem pedir até {maxItems} itens.
            </>
          );
        default: // English
          return (
            <>
              Each person can only order {allowedItems} items at a time. <br />
              You can order up to {maxItems} items.
            </>
          );
      }
    };
    
    

    if (totalQuantity + 1 > maxAllowedItems) {
      toast.warn(renderToastMessage(selectedLanguage, maxAllowedItems));
      return;
    }

    setShoppingCart((prevShoppingCart) => ({
      ...shoppingCart,
      [item.id]: {
        ...item,
        quantity: (shoppingCart[item.id]?.quantity || 0) + 1,
        created_at: new Date().toLocaleString('en-US', { timeZone: 'Atlantic/Azores' }),
      }
    }));
  }


  const onRemoveItemToShoppingCart = (item) => {
    if (totalQuantity === 1) {
      setShowShoppingCart(false);
    }

    setShoppingCart((prevShoppingCart) => ({
      ...shoppingCart,
      [item.id]: {
        ...item,
        quantity: (shoppingCart[item.id]?.quantity || 0) - 1,
      }
    }));
  }
  const totalQuantity = useMemo(
    () => Object.keys(shoppingCart)
      .map((i) => shoppingCart[i].quantity)
      .reduce((a, b) => a + b, 0),
    [shoppingCart]
  );

  useEffect(() => {
    onFetchPlace();
  }, [onFetchPlace]);

  // useEffect(() => { // Removed for 10-min limit
    // if (place && place.tables && params && params.table) {
      // const tableNumber = parseInt(params.table);
      // const table = place.tables.find(
        // (table) => parseInt(table.table_number) === tableNumber
      // );

      // if (table) {
        // Convert the last ordering time to milliseconds since epoch
        // const lastOrderingTimeInSeconds = table.last_ordering_time;
        // const placeCreatedAt = new Date(place.createdAt).getTime();

        // const lastOrderingTimeInMilliseconds = placeCreatedAt + lastOrderingTimeInSeconds * 1000;

        // Calculate the next allowed ordering time
        // const nextAllowedTime = lastOrderingTimeInMilliseconds + place.ordering_limit_interval * 1000;
        // setNextOrderingTime(nextAllowedTime);
      // }
    // }
  // }, [place, params]); // Removed for 10-min limit

    // New useEffect for agreement modal logic
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    // const agreementTimestamp = localStorage.getItem('agreementTimestamp'); // Removed for agreement modal
    // const now = Date.now(); // Removed for agreement modal
    // const twoHours = 2 * 60 * 60 * 1000; // Removed for agreement modal

    if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
    }

    if (!storedLanguage) {
      setShowLanguageModal(true);
    } 
    // else if (!agreementTimestamp || (now - parseInt(agreementTimestamp, 10) > twoHours)) { // Removed for agreement modal
      // setShowAgreementModal(true); // Removed for agreement modal
    // } // Removed for agreement modal
  }, []);

  const [activeTab, setActiveTab] = useState('menu');

    const handleSelectTab = (tabName) => {
      setActiveTab(tabName);
    };

  const renderCategoryName = (category) => {
    switch (selectedLanguage) {
      case '中文':
        return category.name;
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

// const handleAgreementAccept = () => { // Removed for agreement modal
    // const now = Date.now(); // Removed for agreement modal
    // localStorage.setItem('agreementTimestamp', now.toString()); // Removed for agreement modal
    // setShowAgreementModal(false); // Removed for agreement modal
// }; // Removed for agreement modal

  // useEffect(() => { // Removed for 10-min limit
    // const timer = setInterval(() => {
      // if (nextOrderingTime > 0) {
        // const now = Date.now();
        // const timeLeft = Math.max(0, nextOrderingTime - now); // Ensure timeLeft is not negative
        // setTimeLeftToOrder(timeLeft);
        // setEnableOrdering(timeLeft === 0);
      // }
    // }, 500);

    // return () => clearInterval(timer);
  // }, [nextOrderingTime]); // Removed for 10-min limit

  // const { t } = useTranslation(); // This was misplaced, t is initialized at the start of Menu component.

  const OrderHistory = ({ orderHistory }) => {
    // Group items by name
    const groupedItems = orderHistory.reduce((acc, order) => {
      const key = order.name; // Use item name as the key
      if (!acc[key]) {
        acc[key] = { ...order, quantity: 0 };
      }
      acc[key].quantity += order.quantity;
      return acc;
    }, {});

    const totalCost = Object.values(groupedItems).reduce((sum, order) => sum + order.price * order.quantity, 0);


    return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px', textAlign: 'center' }}>{t('orderHistory.title')}</h2>
      {Object.keys(groupedItems).length === 0 ? (
        <p style={{ fontSize: '16px', textAlign: 'center' }}>{t('orderHistory.noOrdersYet')}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left' }}>{t('orderHistory.headers.item')}</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>{t('orderHistory.headers.price')}</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>{t('orderHistory.headers.quantity')}</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>{t('orderHistory.headers.total')}</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedItems).map((order, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '8px' }}>{order.name}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>€{order.price.toFixed(1)}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{order.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>€{(order.price * order.quantity).toFixed(1)}</td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid #dee2e6', fontWeight: 'bold' }}>
              <td colSpan="3" style={{ padding: '8px', textAlign: 'right' }}>{t('orderHistory.totalLabel')}:</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>€{totalCost.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      )}
      {/* Buffet note removed as per user request */}
      {/* <p style={{ fontSize: '14px', marginTop: '15px', textAlign: 'center', color: '#6c757d' }}>
        {t('orderHistory.buffetNote')}
      </p> */}
    </div>
  );
};

  return (
    <>
    <ToastContainer />
    <Container fluid className="mt-2 mb-4">
      {isLoading ? ( // Show loading message while fetching data
        <div className="text-center p-4 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
          </div>
          Loading...
        </div>
      ) : place && place.tables && place.tables.find(t => parseInt(t.table_number) === parseInt(params.table))?.blocked ? (
        <div className="text-center p-4 mt-4 bg-warning border border-warning rounded">
          <h4 className="mb-0">This table is currently unavailable. Please contact a staff member for assistance.</h4>
        </div>
      ) : (
        <>
          {/* Agreement Modal Removed */}

          {/* Filter */}
          <StickyFilterContainer>
            <Row className="d-flex justify-content-between align-items-center flex-nowrap gap-3">
            {/* Category Dropdown */}
            <select
              value={selectedCategoryName}
              onChange={(e) => handleCategoryClick(e.target.value)}
              className="custom-dropdown"
              style={{ fontSize: '14px' }}
            >
              <option value="">{renderFilterAllButton(selectedLanguage)}</option>
              {categories
                .map((name) => (
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

          <div style={{
            backgroundColor: '#FE6C4C',
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '10px'
          }}>
            {t('tableNumberDisplayLabel', { tableId: params.table === '77' ? 'VIP' : params.table })}
          </div>

          <Row className="justifyContent-center m-2">
            {showLanguageModal && (
              <LanguageSelectionModal
                show={showLanguageModal}
                onHide={() => setShowLanguageModal(false)}
                languages={languages}
                selectedLanguage={selectedLanguage}
                onLanguageSelect={handleLanguageSelect}
                tableNumber={params.table}
              />
            )}
          </Row>

          {activeTab === 'menu' && (
            <MenuList
              selectedLanguage={selectedLanguage}
              place={place}
              shoppingCart={shoppingCart}
              onOrder={onAddItemtoShoppingCart}
              onRemove={onRemoveItemToShoppingCart}
              color={place.color}
              font={place.font}
              selectedCategoryName={selectedCategoryName}
              activeTab={activeTab}
            />
          )}
          {activeTab === 'cart' && (
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
              orderingInterval={place.ordering_limit_interval}
              // timeLeftToOrder={timeLeftToOrder} // Prop removed
              enable_ordering={true} // Always enable ordering
              activeTab={activeTab}
              onOrderSuccess={(items) => {
                setShoppingCart({});
                const orderDetails = items.map(item => ({
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity
                }));
                setOrderHistory(prevHistory => [...prevHistory, ...orderDetails]);
                // Set next ordering time // Logic removed
                // setNextOrderingTime(Date.now() + place.ordering_limit_interval * 1000); // Line removed
              }}
            />
          )}
          {activeTab === 'history' && <OrderHistory activeTab={activeTab} orderHistory={orderHistory} />}
          <BottomTabBar activeTab={activeTab} onSelectTab={handleSelectTab} totalQuantity={totalQuantity} />
        </>
      )}
    </Container>
    </>
  );
};

export default Menu;
