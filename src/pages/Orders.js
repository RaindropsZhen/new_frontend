import { IoMdArrowBack } from 'react-icons/io';
import { Row, Col, Button, Table, Nav } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { fetchOrders, completeOrder } from '../apis'; // Import completeOrder function
import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState('processing'); // Added tab state to toggle between orders
  const currentDate = new Date();

  const params = useParams();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const onBack = () => history.push(`/places/${params.id}`);

  const onFetchOrders = async () => {
    const json = await fetchOrders(params.id, auth.token);
    if (json) {
      const filteredOrders = json.filter(
        (order) => order.status === selectedTab
      );
      setOrders(filteredOrders);
    }
  };

  useEffect(() => {
    const updateOrders = async () => {
      await onFetchOrders();
    };
    const interval = setInterval(updateOrders, 2000);
    return () => clearInterval(interval);
  }, [selectedTab]); // Fetch orders when the tab changes

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
    const tableNumber = order.table;
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
        orders: groupedByTable[tableNumber].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
      };
    })
    .sort((a, b) => {
      const latestOrderA = a.orders[0];
      const latestOrderB = b.orders[0];
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const cleanDetailString = (detail) => {
    return detail
      .replace(/True/g, 'true')
      .replace(/False/g, 'false')
      .replace(/None/g, 'null')
      .replace(/'/g, '"');
  };

  const handleUpdateOrderStatus = async (tableNumber) => {
    try {
      const tableOrders = groupedByTable[tableNumber];
      const orderIds = tableOrders.map((order) => order.id);

      const statusData = { status: 'completed' };

      for (const orderId of orderIds) {
        await completeOrder(orderId, statusData, auth.token);
      }

      await onFetchOrders();
      alert(`Table ${tableNumber} orders marked as completed.`);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
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

      {/* Tab Navigation */}
      <Nav variant="tabs" defaultActiveKey="processing">
        <Nav.Item>
          <Nav.Link
            eventKey="processing"
            onClick={() => setSelectedTab('processing')}
          >
            Processing Orders
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="completed"
            onClick={() => setSelectedTab('completed')}
          >
            Done Orders
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Orders List in Grid Layout */}
      <Row>
        {sortedGroupedByTable.length > 0 ? (
          sortedGroupedByTable.map(({ tableNumber, orders }, index) => (
            <Col key={tableNumber} md={4} className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h4>Table {tableNumber}</h4>
                {selectedTab === 'processing' && (
                  <Button
                    variant="success"
                    onClick={() => handleUpdateOrderStatus(tableNumber)}
                  >
                    Mark as Done
                  </Button>
                )}
              </div>
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
                    const orderItems = Array.isArray(
                      JSON.parse(cleanDetailString(order.detail))
                    )
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
