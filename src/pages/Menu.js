// eslint-disable-next-line
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  { "value": 'cn', "label": '中文' }
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
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [place, setPlace] = useState({});
  const [shoppingCart, setShoppingCart] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [showShoppingCart, setShowShoppingCart] = useState(false);
  const params = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [nextOrderingTime, setNextOrderingTime] = useState(0);
  const [enableOrdering, setEnableOrdering] = useState(true);
  const [timeLeftToOrder, setTimeLeftToOrder] = useState(0); //in millisecond
  const takeawayBoxFee = 8.9;

  const [agreementText, setAgreementText] = useState({
    'English': (
      <>
        Please read and acknowledge the following terms:
        <br />
        <br />
        To minimize food waste, a charge of <b>{`${takeawayBoxFee}€`}</b> will be applied for each <b>takeaway box</b> required for uneaten food. 
        We kindly ask you to order according to your appetite.
        <br />
        <br />
        By dining in our restaurant, you acknowledge and accept these terms. Thank you for your understanding.
      </>
    ),
    '中文': (
      <>
        请阅读并确认以下条款：
        <br />
        <br />
        为减少食物浪费，我们将对每个未食用完需打包的<b>外卖盒</b>收取 <b>{`${takeawayBoxFee} 欧`}</b> 的费用。
        敬请根据您的食量合理点餐。
        <br />
        <br />
        在本餐厅用餐，即视为您已知悉并接受此条款。感谢您的理解与配合。
      </>
    ),
    'Português': (
      <>
        Por favor, leia e reconheça os seguintes termos:
        <br />
        <br />
        Para minimizar o desperdício de alimentos, será cobrada uma taxa de <b>{`${takeawayBoxFee}€`}</b> por cada <b>caixa de take-away</b> necessária para a comida não consumida. 
        Pedimos que faça os seus pedidos de acordo com o seu apetite.
        <br />
        <br />
        Ao fazer a sua refeição no nosso restaurante, considera-se que aceita estes termos. Agradecemos a sua compreensão.
      </>
    ),
  });
  
  
  const [agreementTitle, setAgreementTitle] = useState({
    'English': "Agreement",
    '中文': "协议",
    'Português': "Acordo"
  });

  const [agreeButtonText, setAgreeButtonText] = useState({
    'English': "I Agree",
    '中文': "我同意",
    'Português': "Acordo"
  });

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
    // setShowLanguageModal(false); // Don't hide - always show agreement after language select
    localStorage.setItem('selectedLanguage', language);
    setShowAgreementModal(true); // Show agreement modal after language selection
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

  useEffect(() => {
    if (place && place.tables && params && params.table) {
      const tableNumber = parseInt(params.table);
      const table = place.tables.find(
        (table) => parseInt(table.table_number) === tableNumber
      );

      if (table) {
        // Convert the last ordering time to milliseconds since epoch
        const lastOrderingTimeInSeconds = table.last_ordering_time;
        const placeCreatedAt = new Date(place.createdAt).getTime();

        const lastOrderingTimeInMilliseconds = placeCreatedAt + lastOrderingTimeInSeconds * 1000;

        // Calculate the next allowed ordering time
        const nextAllowedTime = lastOrderingTimeInMilliseconds + place.ordering_limit_interval * 1000;
        setNextOrderingTime(nextAllowedTime);
      }
    }
  }, [place, params]);

    // New useEffect for agreement modal logic
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    const agreementTimestamp = localStorage.getItem('agreementTimestamp');
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000; // Two hours in milliseconds

    if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
    }

    if (!storedLanguage) {
      setShowLanguageModal(true);
    } else if (!agreementTimestamp || (now - parseInt(agreementTimestamp, 10) > twoHours)) {
      setShowAgreementModal(true);
    }
  }, []);

  const [activeTab, setActiveTab] = useState('menu');

    const handleSelectTab = (tabName) => {
      setActiveTab(tabName);
    };

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

const handleAgreementAccept = () => {
    const now = Date.now();
    localStorage.setItem('agreementTimestamp', now.toString());
    setShowAgreementModal(false);
};

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextOrderingTime > 0) {
        const now = Date.now();
        const timeLeft = Math.max(0, nextOrderingTime - now); // Ensure timeLeft is not negative
        setTimeLeftToOrder(timeLeft);
        setEnableOrdering(timeLeft === 0);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [nextOrderingTime]);



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
      <h2 style={{ fontSize: '20px', marginBottom: '10px', textAlign: 'center' }}>Order History</h2>
      {Object.keys(groupedItems).length === 0 ? (
        <p style={{ fontSize: '16px', textAlign: 'center' }}>No orders yet</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left' }}>Item</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Quantity</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
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
              <td colSpan="3" style={{ padding: '8px', textAlign: 'right' }}>Total:</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>€{totalCost.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      )}
      <p style={{ fontSize: '14px', marginTop: '15px', textAlign: 'center', color: '#6c757d' }}>
        Please note that buffet per person is not included yet to the total price.
      </p>
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
          {showAgreementModal && (
            <Modal 
            show={showAgreementModal}
            backdrop="static"
            keyboard={false}
            centered
            className="agreementModal"
          >
            {/* Table Number Header */}
            <div style={{
              backgroundColor: '#FE6C4C',
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '12px',
              fontSize: '18px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }}>
              Table Number: {params.table === '77' ? 'VIP' : params.table}
            </div>
          
            {/* Modal Content */}
            <Modal.Body style={{
              padding: '20px',
              fontSize: '16px',
              textAlign: 'center',
              lineHeight: '1.6',
              color: '#333',
              fontWeight: '500'
            }}>
              <h5 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#FE6C4C' }}>
                {agreementTitle[selectedLanguage]}
              </h5>
              <div style={{ textAlign: 'justify', padding: '0 10px' }}>
                {agreementText[selectedLanguage]}
              </div>
            </Modal.Body>
          
            {/* Modal Footer */}
            <Modal.Footer style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '20px',
              borderTop: '1px solid #ddd'
            }}>
              <Button 
                variant="primary" 
                style={{ 
                  backgroundColor: '#FE6C4C', 
                  borderColor: '#FE6C4C', 
                  fontSize: '16px', 
                  padding: '10px 25px', 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#E65A3A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FE6C4C'}
                onClick={handleAgreementAccept}
              >
                {agreeButtonText[selectedLanguage]}
              </Button>
            </Modal.Footer>
          </Modal>
          
          )}

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
                  <option key={language.value} value={language.value}>
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
            Número de Mesa: {params.table === '77' ? 'VIP' : params.table}
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
              timeLeftToOrder={timeLeftToOrder}
              enable_ordering={enableOrdering}
              activeTab={activeTab}
              onOrderSuccess={(items) => {
                setShoppingCart({});
                const orderDetails = items.map(item => ({
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity
                }));
                setOrderHistory(prevHistory => [...prevHistory, ...orderDetails]);
                // Set next ordering time
                setNextOrderingTime(Date.now() + place.ordering_limit_interval * 1000);
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
