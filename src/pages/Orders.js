import { IoMdArrowBack } from 'react-icons/io';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { fetchOrders } from '../apis';
import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const currentDate = new Date();

  const params = useParams();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const onBack = () => history.push(`/places/${params.id}`);

  const onFetchOrders = async () => {
    const json = await fetchOrders(params.id, auth.token);
    if (json) {
      // Filter the orders by status 'processing'
      const filteredOrders = json.filter(order => order.status === 'processing');
      setOrders(filteredOrders);
    }
  };

  useEffect(() => {
    const updateOrders = async () => {
      await onFetchOrders();
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
  });

  // Group orders by table number and sort them by created_at (desc)
  const groupedByTable = today_orders.reduce((acc, order) => {
    const tableNumber = order.table; // Assuming `order.table` is the table number
    if (!acc[tableNumber]) {
      acc[tableNumber] = [];
    }
    acc[tableNumber].push(order);
    return acc;
  }, {});

  // Sort each table's orders by created_at in descending order
  const sortedGroupedByTable = Object.keys(groupedByTable)
    .map((tableNumber) => {
      return {
        tableNumber,
        orders: groupedByTable[tableNumber].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      };
    })
    .sort((a, b) => {
      const latestOrderA = a.orders[0]; // Get the most recent order from table A
      const latestOrderB = b.orders[0]; // Get the most recent order from table B
      return new Date(b.created_at) - new Date(a.created_at); // Sort tables by the most recent order
    });

  // Function to clean up the order detail string
  const cleanDetailString = (detail) => {
    return detail
      .replace(/True/g, 'true') // Replace True with true
      .replace(/False/g, 'false') // Replace False with false
      .replace(/None/g, 'null') // Replace None with null
      .replace(/'/g, '"'); // Replace single quotes with double quotes
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={onBack}>
          <IoMdArrowBack size={25} color="black" />
        </Button>
        <h3 className="mb-0 ml-2">Today's Orders</h3>
      </div>

      {/* Orders List in Grid Layout */}
      <Row>
        {sortedGroupedByTable.length > 0 ? (
          sortedGroupedByTable.map(({ tableNumber, orders }, index) => (
            <Col key={tableNumber} md={4} className="mb-4">
              <h4>Table {tableNumber}</h4>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Item Name</th>
                    <th>Item Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, orderIndex) => {
                    // Clean the detail string before parsing it
                    const orderItems = Array.isArray(JSON.parse(cleanDetailString(order.detail))) 
                      ? JSON.parse(cleanDetailString(order.detail)) 
                      : [];

                    return (
                      <>
                        {orderItems.map((item, itemIndex) => (
                          <tr key={`${orderIndex}-${itemIndex}`}>
                            <td>{new Date(order.created_at).toLocaleTimeString()}</td>
                            <td>{item.name}</td>
                            <td>${item.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No orders found for today.</p>
          </Col>
        )}
      </Row>
    </MainLayout>
  );
};

export default Orders;
