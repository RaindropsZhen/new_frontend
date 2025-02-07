import React, { useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';
import OperationButton from './OperationButton';
import { useLocation } from 'react-router-dom';
import OrderForm from '../containers/OrderForm';


const renderMenuItemName = (item,selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return item.name;
      case 'English':
      return item.name_en;
      case 'Español':
      return item.name_es;
      case 'Português':
      return item.name_pt;
    default:
      return item.name;
  }
};

const ShoppingCart = ({ selectedLanguage, items, onAdd, onRemove, color, last_ordering_timing, orderingInterval, timeLeftToOrder, enable_ordering, onOrderSuccess }) => {
  const location = useLocation(); // This gives you the location object
    const pathParts = location.pathname.split('/');

  // Delete this code, no TakeAway Feature implemented
  const isTakeAway = pathParts[pathParts.length - 1].includes('takeaway');
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [arrivalTime, setarrivalTime] = useState(null);
  const [name, setName] = useState('');
  const [allcomment, setAllComment] = useState({}) // No comment made
  // Delete this code, no TakeAway Feature implemented

  const renderOrdername = (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return "您的订单";
      case 'English':
        return "Your Order";
      case 'Español':
        return "Su pedido";
      case 'Português':
        return "Seu pedido";
      default:
        return "Your Order";
    }
  };
  const renderWarning = (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return "Somente um pedido a cada 10 minutos";
      case 'English':
        return "Only one order allowed every 10 minutes";
      case 'Español':
        return "Somente um pedido a cada 10 minutos";
      case 'Português':
        return "Somente um pedido a cada 10 minutos";
      default:
        return "Only one order allowed every 10 minutes";
    }
  };

  const renderTotal = (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return "总计";
      case 'English':
        return "Total";
      case 'Español':
        return "Total";
      case 'Português':
        return "Total";
      default:
        return "Total";
    }
  };

  const totalPrice = useMemo(
    () => items.map((i) => i.quantity * i.price).reduce((a, b) => a + b, 0),
    [items]
  );

  return (
    <>
      <h3 className="text-center mb-4">
        <b>{renderOrdername(selectedLanguage)}</b>
      </h3>
      <h3 className="text-center mb-4 text-danger" style={{ fontSize: '20px' }}>
        <b>{renderWarning(selectedLanguage)}</b>
      </h3>

      <Card style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          {/* Items List */}
          {items.map((item) => (
            <div key={item.id} className="d-flex mb-4 align-items-center">
              <div className="flex-grow-1">
                <p className="mb-1" style={{ fontSize: '20px', fontWeight: '500' }}>
                  {renderMenuItemName(item, selectedLanguage)}
                </p>
                {item.price > 0 && (
                  <p className="mb-0" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    <b>€{item.price}</b>
                  </p>
                )}
              </div>

              {/* Operational Buttons */}
              <div className="d-flex align-items-center">
                <OperationButton
                  variant="lightgray"
                  size="sm"
                  onClick={() => onRemove(item)}
                  className="me-2"
                >
                  -
                </OperationButton>
                <span style={{ fontWeight: '500', fontSize: '1rem', minWidth: '30px', textAlign: 'center' }}>
                  {item.quantity >= 0 ? item.quantity : 0}
                </span>
                <OperationButton
                  variant="lightgray"
                  size="sm"
                  onClick={() => onAdd(item)}
                  className="ms-2"
                >
                  +
                </OperationButton>
              </div>
            </div>
          ))}

          {/* Divider */}
          <hr />

          {/* Total Section */}
          <hr />
          <div className="d-flex justify-content-between">
            <h5><b>{renderTotal(selectedLanguage)}</b></h5>
            <h5><b>€{totalPrice.toFixed(1)}</b></h5>
          </div>
          <hr className="mb-4" />

          {/* Divider */}
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
            onOrderSuccess={() => onOrderSuccess(items)}
          />
          {/* Order Form */}
        </Card.Body>
      </Card>
    </>
  );
};

export default ShoppingCart;
