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
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  return formattedTime;
};

const OrderForm = ({amount, items, color, selectedLanguage, isTakeAway, phoneNumber, arrivalTime,comment,customer_name,timeLeftToOrder,enable_ordering}) => {
  const formRef = useRef(null);
  const history = useHistory(); // Get the history object to navigate
  const [loading, setLoading] = useState(false)
  const auth = useContext(AuthContext)
  const params = useParams()

  // const url = `/menu/${params.id}/select_table`

  const url = `/menu/${params.code}/${params.id}/${params.table}`;
  // const [recaptchaValue, setRecaptchaValue] = useState(null);
  // const [recaptchaCompleted, setRecaptchaCompleted] = useState(false);
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
        return `成功下单：订单号 ${orderNumber}`;
      case 'English':
        return `Successfully placed an order: Order #${orderNumber}`;
      case 'Español':
        return `Pedido realizado con éxito: Orden #${orderNumber}`;
      case 'Português':
        return `Pedido realizado com sucesso: Pedido #${orderNumber}`;
      default:
        return `Successfully placed an order: Order #${orderNumber}`;
    }
  };

  
  const createOrder = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);   // Start the loading state
  
    try {
      // Perform validation checks for take-away orders
      if (isTakeAway && (!phoneNumber || !arrivalTime)) {
        toast("请确保已输入电话号码或者到达时间", {type: "error"});
        setLoading(false); // Stop the loading state
        return; // Exit the function if validation fails
      }
  
      // Proceed with creating the order
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
        // recaptchaToken: recaptchaValue, // Include the recaptchaValue in the request
      }, auth.token);
  
      // Handle the response
      if (json?.success) {
        toast.success(
          renderOrderSuccessMessage(selectedLanguage, json.order),
          {
            autoClose: false,
            // Optionally, add other options such as an icon
          }
        );
        // window.location.reload()
        setTimeout(() => {
          formRef.current.submit();
        }, 10000);
      } else if (json?.error) {
        toast(json.error, {type: "error"});
      }
    } catch (error) {
      // Handle any errors that occur during the order creation
      toast("Error processing order", {type: "error"});
    } finally {
      setLoading(false); // Ensure loading state is stopped in all cases

    }

  };

  // const onChange = (value) => {
  //   // Update the reCAPTCHA value when it changes

  //   setRecaptchaValue(value);
  //   setRecaptchaCompleted(true);

  // };

  return (
    <Form onSubmit={createOrder} ref={formRef}>

  {/* <div>
    <ReCAPTCHA
      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      onChange={onChange}
    />
    
  </div> */}

    <Button 
      variant='standard' 
      style={{backgroundColor: '#FE6C4C'}} 
      className='.t-4' 
      block 
      type="submit" 
      disabled={loading || 
        // !recaptchaCompleted || 
        !enable_ordering} 
    >
      {loading ? renderProcessing(selectedLanguage) : enable_ordering ? renderTotal(selectedLanguage) : `${renderOrderingLimitMessage(selectedLanguage)} ${formatTime(timeLeftToOrder)}`}
    </Button>
  </Form>

  )
} 

export default OrderForm;