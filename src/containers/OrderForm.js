import React, { useState, useContext, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    createOrderIntent
  } from '../apis';

import AuthContext from '../contexts/AuthContext';
const createdAt = new Date().toLocaleString('en-US', { timeZone: 'Atlantic/Azores' });

const renderTableVerificationMessage = (selectedLanguage, tableNumber) => {
  const tableDisplay = tableNumber === '77' ? 'VIP' : tableNumber;

  switch (selectedLanguage) {
    case '中文':
      return `请确认您的桌号是 ${tableDisplay}，以免订单送错桌。`;
    case 'English':
      return `Please verify your table number is ${tableDisplay} to avoid order delivery to the wrong table.`;
    case 'Español':
      return `Por favor, verifique que su número de mesa es ${tableDisplay} para evitar la entrega incorrecta del pedido.`;
    case 'Português':
      return `Por favor, verifique se o número da sua mesa é ${tableDisplay} para evitar a entrega errada do pedido.`;
    default:
      return `Please verify your table number is ${tableDisplay} to avoid order delivery to the wrong table.`;
  }
};

const OrderForm = ({amount, items, color, selectedLanguage, isTakeAway, phoneNumber, arrivalTime,comment,customer_name, onOrderSuccess}) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false)
  const auth = useContext(AuthContext)
  const params = useParams()

  const renderTotal= (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return "下单";
      case 'English':
        return "Place Order";
      case 'Español':
        return "Enviar el pedido";
      case 'Português':
        return "Enviar o pedido";
    }
  };

  const renderProcessing= (selectedLanguage) => {
    switch (selectedLanguage) {
      case '中文':
        return "发送中";
      case 'English':
        return "Processing";
      case 'Español':
        return "Procesando";
      case 'Português':
        return "Processando";

    }
  };
  const renderOrderSuccessMessage = (selectedLanguage, orderNumber) => {
    switch (selectedLanguage) {
      case '中文':
        return `成功下单：订单号 ${orderNumber || ''}`;
      case 'English':
        return `Successfully placed an order: Order #${orderNumber || ''}`;
      case 'Español':
        return `Pedido realizado con éxito: Orden #${orderNumber || ''}`;
      case 'Português':
        return `Pedido realizado com sucesso: Pedido #${orderNumber || ''}`;
      default:
        return `Successfully placed an order: Order #${orderNumber || ''}`;
    }
  };

  
  const createOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isTakeAway && (!phoneNumber || !arrivalTime)) {
        toast("请确保已输入电话号码或者到达时间", { type: "error" });
        setLoading(false);
        return;
      }

      const json = await createOrderIntent({
        amount,
        place: params.id,
        table: params.table,
        detail: items,
        isTakeAway: isTakeAway,
        comment: comment,
        phoneNumber: phoneNumber,
        arrival_time: arrivalTime,
        language: selectedLanguage,
        customer_name: customer_name,
        created_at: createdAt,
      }, auth.token);

      if (json?.success && json.order_id) { // Check for order_id instead of order
        toast.success(
          renderOrderSuccessMessage(selectedLanguage, json.order_id), // Pass order_id
          {
            autoClose: false,
          }
        );
        onOrderSuccess(items);
      } else if (json?.error) {
        toast(json.error, {type: "error"});
        onOrderSuccess(items);
      } else {
        toast.error("Failed to create order. Please try again.", { type: "error" });
        onOrderSuccess(items);
      }

    } catch (error) {
      toast(error.message || "Error processing order", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={createOrder} ref={formRef}>
    <div style={{ marginBottom: '10px', color: '#333', fontWeight: 'bold' }}>
      {renderTableVerificationMessage(selectedLanguage, params.table)}
    </div>
    <Button 
      variant='standard' 
      style={{backgroundColor: '#FE6C4C'}} 
      className='.t-4' 
      block 
      type="submit" 
      disabled={loading} // Only disable if loading
    >
      {loading ? renderProcessing(selectedLanguage) : renderTotal(selectedLanguage)}
    </Button>
  </Form>

  )
} 

export default OrderForm;
