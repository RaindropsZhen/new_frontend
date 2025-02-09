// eslint-disable-next-line
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
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

    const [place, setPlace] = useState({});
  const [shoppingCart, setShoppingCart] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [showShoppingCart, setShowShoppingCart] = useState(false);
  const params = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [nextOrderingTime, setNextOrderingTime] = useState(0);
  const [enableOrdering, setEnableOrdering] = useState(true);
  const [timeLeftToOrder, setTimeLeftToOrder] = useState(0); //in millisecond
  const [agreementText, setAgreementText] = useState({
    en: "Please read and accept the following:<br /><br />To help reduce food waste, we charge <b>8.5€</b> for each <b>takeaway box</b> needed for uneaten food. Please order according to your appetite. Thank you for your understanding.",
    cn: "请阅读并接受以下协议：<br /><br />为了减少食物浪费，我们会对未食用完需要打包的食物收取<b>8.5欧</b>的<b>外卖盒</b>费用。请根据您的食量点餐。感谢您的理解。",
    pt: "Por favor, leia e aceite o seguinte:<br /><br />Para ajudar a reduzir o desperdício de alimentos, cobramos <b>8,5€</b> por cada caixa de take-away necessária para a comida não consumida. Por favor, peça de acordo com o seu apetite. Obrigado pela sua compreensão."
  });
  const [agreementTitle, setAgreementTitle] = useState({
    en: "Agreement",
    cn: "协议",
    pt: "Acordo"
  });

  const [agreeButtonText, setAgreeButtonText] = useState({
    en: "I Agree",
    cn: "我同意",
    pt: "Eu Concordo"
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
    setShowLanguageModal(false);
    localStorage.setItem('selectedLanguage', language);
    setShowAgreementModal(true);

    // Update agreement text based on selected language
    let newAgreementText = {};
    let newAgreementTitle = {};
    let newAgreeButtonText = {};
    switch (language) {
      case '中文':
        newAgreementText = {
          en: "Please read and accept the following:<br /><br />To help reduce food waste, we charge <b>8.5€</b> for each <b>takeaway box</b> needed for uneaten food. Please order according to your appetite. Thank you for your understanding.",
          cn: "请阅读并接受以下协议：<br /><br />为了减少食物浪费，我们会对未食用完需要打包的食物收取<b>8.5欧</b>的<b>外卖盒</b>费用。请根据您的食量点餐。感谢您的理解。",
          pt: "Por favor, leia e aceite o seguinte acordo: <br /> Não incentivamos o desperdício de alimentos. Os alimentos desperdiçados precisam ser comprados com uma caixa para viagem, 8,5 euros por caixa. Por favor, peça de acordo com o seu apetite."
        };
        newAgreementTitle = {
          en: "Agreement",
          cn: "协议",
          pt: "Acordo"
        };
        newAgreeButtonText = {
          en: "I Agree",
          cn: "我同意",
          pt: "Eu Concordo"
        };
        break;
      case 'Português':
        newAgreementText = {
          en: "Please read and accept the following agreement: <br /> We do not encourage food waste. Wasted food needs to be purchased with a takeaway box, 8.5 euros per box. Please order according to your appetite.",
          cn: "请阅读并接受以下协议：<br /> 我们不提倡浪费食物，浪费的食物需要购买外卖盒带走，8.5欧元每一个盒子。请按照自己的食量点单。",
          pt: "Por favor, leia e aceite o seguinte acordo: <br /> Não incentivamos o desperdício de alimentos. Os alimentos desperdiçados precisam ser comprados com uma caixa para viagem, 8,5 euros por caixa. Por favor, peça de acordo com o seu apetite."
        };
        newAgreementTitle = {
          en: "Agreement",
          cn: "协议",
          pt: "Acordo"
        };
        newAgreeButtonText = {
          en: "I Agree",
          cn: "我同意",
          pt: "Eu Concordo"
        };
        break;
      default:
        newAgreementText = {
          en: "Please read and accept the following agreement: <br /> We do not encourage food waste. Wasted food needs to be purchased with a takeaway box, 8.5 euros per box. Please order according to your appetite.",
          cn: "请阅读并接受以下协议：<br /> 我们不提倡浪费食物，浪费的食物需要购买外卖盒带走，8.5欧元每一个盒子。请按照自己的食量点单。",
          pt: "Por favor, leia e aceite o seguinte acordo: <br /> Não incentivamos o desperdício de alimentos. Os alimentos desperdiçados precisam ser comprados com uma caixa para viagem, 8,5 euros por caixa. Por favor, peça de acordo com o seu apetite."
        };
        newAgreementTitle = {
          en: "Agreement",
          cn: "协议",
          pt: "Acordo"
        };
        newAgreeButtonText = {
          en: "I Agree",
          cn: "我同意",
          pt: "Eu Concordo"
        };
        break;
    }
    setAgreementText(newAgreementText);
    setAgreementTitle(newAgreementTitle);
    setAgreeButtonText(newAgreeButtonText);
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
    }
  }, [params.id]);

  const onAddItemtoShoppingCart = (item) => {
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

  useEffect(() => {
    if (localStorage.getItem('agreementAccepted') !== 'true' && !localStorage.getItem('selectedLanguage')) {
      setShowLanguageModal(true);
    } else {
      setShowLanguageModal(false);
    }
  }, []);

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
    localStorage.setItem('agreementAccepted', 'true');
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

  const [activeTab, setActiveTab] = useState('menu');

  const handleSelectTab = (tabName) => {
    setActiveTab(tabName);
  };

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
    <Container fluid className="mt-2 mb-4">
        {place && place.tables && place.tables.find(t => parseInt(t.table_number) === parseInt(params.table))?.blocked ? (
            <div className="text-center p-4 mt-4 bg-warning border border-warning rounded">
                <h4 className="mb-0">This table is currently unavailable. Please contact a staff member for assistance.</h4>
            </div>
        ) : (
            <>
      {showAgreementModal && (
        <Modal>
          show={showAgreementModal}
          backdrop="static"
          keyboard={false}
          style={{ borderRadius: '15px', overflow: 'hidden' }}
          className="agreementModal"
        >
          <div style={{
            backgroundColor: '#FE6C4C',
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '10px',
            fontSize: '18px'
          }}>
            Número de Mesa: {params.table === '77' ? 'VIP' : params.table}
          </div>
          <Modal.Header closeButton style={{ padding: '5px' }}>
            <Modal.Title style={{ padding: '10px', fontSize: '16px'  }}>{agreementTitle[selectedLanguage === '中文' ? 'cn' : selectedLanguage === 'Português' ? 'pt' : 'en']}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{fontSize: '14px'}} className="languageModelBody" dangerouslySetInnerHTML={{ __html: agreementText[selectedLanguage === '中文' ? 'cn' : selectedLanguage === 'Português' ? 'pt' : 'en'] }} />
          <Modal.Footer>
            <Button variant="primary" style={{ backgroundColor: '#FE6C4C', borderColor: '#FE6C4C', fontSize: '14px' }} onClick={handleAgreementAccept}>
              {agreeButtonText[selectedLanguage === '中文' ? 'cn' : selectedLanguage === 'Português' ? 'pt' : 'en']}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Filter */}
      <StickyFilterContainer >
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
        fontSize: '16px', /* Reduced font size */
        borderRadius: '10px'
      }}>
        {/* Render message accordigly to the language selected */}
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
  );
};

export default Menu;
