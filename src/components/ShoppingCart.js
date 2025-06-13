import React, { useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';
import OperationButton from './OperationButton';
import { useLocation } from 'react-router-dom';
import OrderForm from '../containers/OrderForm';

const renderMenuItemName = (item, selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文': return item.name;
    case 'English': return item.name_en;
    case 'Español': return item.name_es;
    case 'Português': return item.name_pt;
    default: return item.name;
  }
};

const ShoppingCart = ({ selectedLanguage, items, onAdd, onRemove, color, timeLeftToOrder, enable_ordering, onOrderSuccess }) => {
  const location = useLocation();
  const isTakeAway = location.pathname.includes('takeaway');
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [name, setName] = useState('');
  const [allcomment, setAllComment] = useState({});

  const renderOrdername = (selectedLanguage) => ({
    '中文': "您的订单",
    'English': "Your Order",
    'Español': "Su pedido",
    'Português': "Seu pedido"
  }[selectedLanguage] || "Your Order");

  const renderWarning = (selectedLanguage) => ({
    '中文': "每10分钟只能下一个订单",
    'English': "Only one order allowed every 10 minutes",
    'Español': "Solo se permite un pedido cada 10 minutos",
    'Português': "Somente um pedido a cada 10 minutos"
  }[selectedLanguage] || "Only one order allowed every 10 minutes");

  const renderTotal = (selectedLanguage) => ({
    '中文': "总计",
    'English': "Total",
    'Español': "Total",
    'Português': "Total"
  }[selectedLanguage] || "Total");

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.quantity * item.price, 0),
    [items]
  );

  return (
    <>
      {/* Order Title */}
      <h3 className="text-center mb-3" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', fontWeight: 'bold' }}>
        {renderOrdername(selectedLanguage)}
      </h3>

      {/* Warning Message */}
      <h3 className="text-center mb-3 text-danger" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)', fontWeight: 'bold' }}>
        {renderWarning(selectedLanguage)}
      </h3>

      {/* Shopping Cart Card */}
      <Card style={{ width: '100%', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '15px' }}>
        <Card.Body>
          {/* Items List */}
          {items.map((item) => (
            <div key={item.id} className="d-flex align-items-center mb-3">
              <div className="flex-grow-1">
                <p className="mb-1" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', fontWeight: '500' }}>
                  {renderMenuItemName(item, selectedLanguage)}
                </p>
                {item.price > 0 && (
                  <p className="mb-0" style={{ color: '#6c757d', fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>
                    <b>€{item.price}</b>
                  </p>
                )}
              </div>

              {/* Operational Buttons */}
              <div className="d-flex align-items-center">
                <OperationButton variant="lightgray" size="sm" onClick={() => onRemove(item)} className="me-2">
                  -
                </OperationButton>
                <span style={{ fontWeight: '500', fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', minWidth: '30px', textAlign: 'center' }}>
                  {item.quantity >= 0 ? item.quantity : 0}
                </span>
                <OperationButton variant="lightgray" size="sm" onClick={() => onAdd(item)} className="ms-2">
                  +
                </OperationButton>
              </div>
            </div>
          ))}

          {/* Divider */}
          <hr />

          {/* Total Section */}
          <div className="d-flex justify-content-between align-items-center">
            <h5 style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', fontWeight: 'bold' }}>{renderTotal(selectedLanguage)}</h5>
            <h5 style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', fontWeight: 'bold' }}>€{totalPrice.toFixed(1)}</h5>
          </div>

          <hr className="mb-4" />

          {/* Order Form */}
          <OrderForm
            selectedLanguage={selectedLanguage}
            amount={totalPrice}
            items={items}
            color={color}
            isTakeAway={isTakeAway}
            phoneNumber={phoneNumber}
            arrivalTime={arrivalTime}
            comment={allcomment}
            customer_name={name}
            timeLeftToOrder={timeLeftToOrder}
            enable_ordering={enable_ordering}
            onOrderSuccess={onOrderSuccess}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default ShoppingCart;
