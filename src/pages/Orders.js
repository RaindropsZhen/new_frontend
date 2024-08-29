import { IoMdArrowBack } from 'react-icons/io';
import { Row, Col, Button, Tab, Nav  } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useContext, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import PrintableOrders from '../components/PrintableOrders';
import { fetchOrders, completeOrder } from '../apis';
import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Order from '../components/Order';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const currentDate = new Date();
  const componentRef = useRef();

  const params = useParams();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const onBack = () => history.push(`/places/${params.id}`);

  const onFetchOrders = async () => {
    const json = await fetchOrders(params.id, auth.token);
    if (json) {
      setOrders(json);
    }
    return json
  }

  const onCompleteOrder = async (orderId) => {
    const json = await completeOrder(orderId, { status: "completed"}, auth.token);
    if (json) {
      onFetchOrders();
    }
  }

  const onPrintOrder = async (orderId) => {
    const orderToPrint = orders.find(o => o.id === orderId);
    if (orderToPrint && !orderToPrint.isPrinted) {
      const json = await completeOrder(orderId, { isPrinted: true }, auth.token);
      if (json) {
        onFetchOrders();
      }
    }
  }

  useEffect(() => {
    const updateOrders = async () => {
      const newOrders = await onFetchOrders();
    };
    const interval = setInterval(updateOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const today_orders = orders?.filter((order) => {
    const orderDate = new Date(order.created_at);
    return (
      orderDate.getDate() === currentDate.getDate() &&
      orderDate.getMonth() === currentDate.getMonth() &&
      orderDate.getFullYear() === currentDate.getFullYear()
    );
  })
  const unprintedOrders = today_orders.filter(order => !order.is_Printed);

  const totalAmount = today_orders.length;
  const completedOrders = today_orders.filter(order => order.status === 'completed').length;
  let completion_percentage;

  if (totalAmount === null || completedOrders === null || completedOrders === 0) {
      completion_percentage = 0;
  } else {
      completion_percentage = ((completedOrders / totalAmount) * 100).toFixed(2);
  }
  
  const getProgressBarStyle = (completionPercentage) => {
    let backgroundColor;
    let textColor;
  
    if (completionPercentage >= 75) {
      backgroundColor = 'green';
      textColor = 'white';
    } else if (completionPercentage >= 50) {
      backgroundColor = 'yellow';
      textColor = 'black';
    } else {
      backgroundColor = 'red';
      textColor = 'white';
    }
  
    return {
      backgroundColor,
      width: `${completionPercentage}%`,
      color: textColor,
    };
  };
  return (
    <MainLayout>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={onBack}>
          <IoMdArrowBack size={25} color="black" />
        </Button>
        <h3 className="mb-0 ml-2 mr-2">我的订单</h3>
      </div>

      <PrintableOrders ref={componentRef} orders={unprintedOrders} style={{ display: "none" }}/>


      {/* orders completion status */}
      <Row className="d-flex justify-content-center">
        <div className="p-2 d-flex justify-content-center">
          <p><strong>总订单:</strong> {totalAmount}</p>
        </div>
        <div className="p-2 d-flex justify-content-center">
          <p><strong>已完成订单:</strong> {completedOrders}</p>
        </div>
      </Row>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={getProgressBarStyle(completion_percentage)}>
          &nbsp;{`${completion_percentage}% 订单完成率`}
        </div>
      </div>

      <Tab.Container id="orders-tabs" defaultActiveKey="notCompleted">
        <Row className="justify-content-center">
          <Col className="justify-content-center">
            <Nav variant="tabs" className="d-flex justify-content-center">
              <Nav.Item>
                <Nav.Link eventKey="takeAway">外卖订单</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="inRestaurant">堂食订单</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="completed">已完成订单</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Tab.Content>
          <Tab.Pane eventKey="takeAway">
            {today_orders
              ?.filter((order) => order.status === "processing" && order.isTakeAway)
              ?.map((order) => (
                <Col key={order.id} lg={8}>
                  <Order order={order} onComplete={() => onCompleteOrder(order.id)} onPrintOrder={() => onPrintOrder(order.id)} />
                </Col>
              ))}
          </Tab.Pane>

          <Tab.Pane eventKey="inRestaurant">
            {today_orders
              ?.filter((order) => order.status === "processing" && !order.isTakeAway)
              ?.map((order) => (
                <Col key={order.id} lg={8}>
                  <Order order={order} onComplete={() => onCompleteOrder(order.id)} onPrintOrder={() => onPrintOrder(order.id)} />
                </Col>
              ))}
          </Tab.Pane>

          <Tab.Pane eventKey="completed">
            {orders
              ?.filter((order) => order.status === "completed")
              ?.filter((order) => {
                const orderDate = new Date(order.created_at);
                return (
                  orderDate.getDate() === currentDate.getDate() &&
                  orderDate.getMonth() === currentDate.getMonth() &&
                  orderDate.getFullYear() === currentDate.getFullYear()
                );
              })
              ?.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return  dateB - dateA;
              })
              ?.map((order) => (
                <Col key={order.id} lg={8}>
                  <Order order={order} />
                </Col>
              ))}

          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </MainLayout>
  );
}

export default Orders;

