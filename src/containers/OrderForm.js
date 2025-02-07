import React, { useState, useContext, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams,useHistory  } from 'react-router-dom';
// import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';
import { 
    createOrderIntent
  } from '../apis';

import AuthContext from '../contexts/AuthContext';

const renderOrderingLimitMessage = (selectedLanguage) => {
  switch (selectedLanguage) {
    case '中文':
      return '下单剩余时间：';
    case 'English':
      return 'Time left to order: ';
    case 'Español':
      return 'Tiempo restante para ordenar: ';
    case 'Português':
      return 'Tempo restante para encomendar: ';
    default:
      return ;
  }
};
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

const OrderForm = ({amount, items, color, selectedLanguage, isTakeAway, phoneNumber, arrivalTime,comment,customer_name,timeLeftToOrder,enable_ordering, onOrderSuccess}) => {
    const formatTime = (milliseconds) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const remainingSeconds = totalSeconds % 60;
      const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
      return formattedTime;
    };
  const formRef = useRef(null);
    // const history = useHistory(); // Get the history object to navigate
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
      }, auth.token);

      if (json?.success && json.order) {
        toast.success(
          renderOrderSuccessMessage(selectedLanguage, json.order),
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
      disabled={loading || 
        !enable_ordering} 
    >
      {loading ? renderProcessing(selectedLanguage) : enable_ordering ? renderTotal(selectedLanguage) : `${renderOrderingLimitMessage(selectedLanguage)} ${formatTime(timeLeftToOrder)}`}
    </Button>
  </Form>

  )
} 

export default OrderForm;
