import { Container, Row} from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [place, setPlace] = useState({});
  const [shoppingCart, setShoppingCart] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [tableNumberText, setTableNumberText] = useState({
    'English': "Table Number: ",
    '中文': "桌号：",
    'Português': "Número da Mesa: "
  });

  const [orderHistoryTexts, setOrderHistoryTexts] = useState({
    title: { 'English': "Order History", '中文': "订单历史", 'Português': "Histórico de Pedidos" },
    noOrders: { 'English': "No orders yet", '中文': "暂无订单", 'Português': "Nenhum pedido ainda" },
    itemHeader: { 'English': "Item", '中文': "项目", 'Português': "Item" },
    priceHeader: { 'English': "Price", '中文': "价格", 'Português': "Preço" },
    quantityHeader: { 'English': "Quantity", '中文': "数量", 'Português': "Quantidade" },
    totalHeader: { 'English': "Total", '中文': "小计", 'Português': "Total" },
    grandTotalLabel: { 'English': "Total:", '中文': "总计：", 'Português': "Total:" }
    // buffetNote removed
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
    setShowLanguageModal(false); // Hide language modal after selection
    localStorage.setItem('selectedLanguage', language);
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

    // New useEffect for agreement modal logic
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    // const agreementTimestamp = localStorage.getItem('agreementTimestamp'); // Removed unused variable
    // const now = Date.now(); // Removed unused variable
    // const twoHours = 2 * 60 * 60 * 1000; // Two hours in milliseconds

    if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
    }

    if (!storedLanguage) {
      setShowLanguageModal(true);
    } 
  }, []);

  const [activeTab, setActiveTab] = useState('menu');

    const handleSelectTab = (tabName) => {
      setActiveTab(tabName);
    };

  const renderCategoryName = useCallback((category) => {
    switch (selectedLanguage) {
      case '中文':
        return category.name; // Changed from category.name_cn
      case 'English':
        return category.name_en;
      case 'Português':
        return category.name_pt;
      default:
        return category.name; // Ensure your category objects have these properties
    }
  }, [selectedLanguage]);

  const categories = useMemo(() => {
    if (!place || !place.categories) return [];
    return place.categories.map(category => renderCategoryName(category));
  }, [place.categories, renderCategoryName]);

  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  useEffect(() => {
    if (categories.length > 0) {
      // Only reset if a specific category is selected (not "All") AND it's no longer in the list.
      if (selectedCategoryName && !categories.includes(selectedCategoryName)) {
        setSelectedCategoryName(categories[0]);
      }
      // If selectedCategoryName is "" (for "All"), or if it's a valid category, no change is needed here.
    } else {
      // If no categories exist, "All" (empty string) is the correct state.
      setSelectedCategoryName('');
    }
  }, [categories, selectedCategoryName]);

  const handleCategoryClick = (name) => {
    setSelectedCategoryName(name);
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
      <h2 style={{ fontSize: '20px', marginBottom: '10px', textAlign: 'center' }}>{orderHistoryTexts.title[selectedLanguage]}</h2>
      {Object.keys(groupedItems).length === 0 ? (
        <p style={{ fontSize: '16px', textAlign: 'center' }}>{orderHistoryTexts.noOrders[selectedLanguage]}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left' }}>{orderHistoryTexts.itemHeader[selectedLanguage]}</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>{orderHistoryTexts.priceHeader[selectedLanguage]}</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>{orderHistoryTexts.quantityHeader[selectedLanguage]}</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>{orderHistoryTexts.totalHeader[selectedLanguage]}</th>
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
              <td colSpan="3" style={{ padding: '8px', textAlign: 'right' }}>{orderHistoryTexts.grandTotalLabel[selectedLanguage]}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>€{totalCost.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      )}
      {/* Buffet note paragraph removed */}
    </div>
  );
};

  return (
    <>
    {/* <ToastContainer /> // Removed to prevent duplicate toasts, App.js has one */}
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
          <StickyFilterContainer>
            <Row className="d-flex justify-content-between align-items-center flex-nowrap gap-3">
            <select
              value={selectedCategoryName}
              onChange={(e) => handleCategoryClick(e.target.value)}
              className="custom-dropdown"
            >
              <option value="">{renderFilterAllButton(selectedLanguage)}</option>
              {categories
                .map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
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
            {tableNumberText[selectedLanguage]}{params.table === '77' ? 'VIP' : params.table}
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
              orderingInterval={place.ordering_limit_interval} // This might still be needed by ShoppingCart for other purposes, or can be removed if not.
              activeTab={activeTab}
              onOrderSuccess={(items) => {
                setShoppingCart({});
                const orderDetails = items.map(item => ({
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity
                }));
                setOrderHistory(prevHistory => [...prevHistory, ...orderDetails]);
              }}
            />
          )}
          {activeTab === 'history' && <OrderHistory activeTab={activeTab} orderHistory={orderHistory} />}
          <BottomTabBar activeTab={activeTab} onSelectTab={handleSelectTab} totalQuantity={totalQuantity} selectedLanguage={selectedLanguage} />
        </>
      )}
    </Container>
    </>
  );
};

export default Menu;
