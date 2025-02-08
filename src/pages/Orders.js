import { IoMdArrowBack } from 'react-icons/io';
import { Row, Col, Button, Table, Modal } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { fetchOrders, completeOrder, reprintOrder } from '../apis';
import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const currentDate = new Date();
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedTable, setSelectedTable] = useState(null); // State for selected table
  const [selectedTableOrders, setSelectedTableOrders] = useState({}); // State for selected table's orders

    const params = useParams();
    const history = useHistory();
  const auth = useContext(AuthContext);

  const onBack = () => history.push(`/places/${params.id}`);

  const onFetchOrders = async () => {
    const json = await fetchOrders(params.id, auth.token);
    if (json) {
      setOrders(json);
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

  // Group orders by table number and daily_id
    const groupedByTable = today_orders.reduce((acc, order) => {
        const tableNumber = order.table;
        const dailyId = order.daily_id;
        if (!acc[tableNumber]) {
            acc[tableNumber] = {};
        }
        if (!acc[tableNumber][dailyId]) {
            acc[tableNumber][dailyId] = [];
        }
        acc[tableNumber][dailyId].push(order);
        return acc;
    }, {});

    const sortedTableNumbers = Object.keys(groupedByTable).sort((a, b) => a - b);

    const cleanDetailString = (detail) => {
        return detail
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/None/g, 'null')
        .replace(/'/g, '"');
    };

  const handleUpdateOrderStatus = async (tableNumber, dailyId) => {
     try {
      // Filter orders by table number and daily ID
      const dailyIdOrders = groupedByTable[tableNumber][dailyId].filter(
        (order) => order.status === 'processing'
      );

      const orderIds = dailyIdOrders.map((order) => order.id);
      const statusData = { status: 'completed' };

      for (const orderId of orderIds) {
        await completeOrder(orderId, statusData, auth.token);
      }

      await onFetchOrders();
      alert(`Table ${tableNumber}, Order ID ${dailyId} marked as completed.`);
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

            {/* Table Buttons */}
            <Row>
                {sortedTableNumbers.length > 0 ? (
                sortedTableNumbers.map((tableNumber) => (
                    <Col key={tableNumber} xs={6} sm={4} md={3} lg={2} className="mb-4">
                    <Button
                        variant="outline-primary"
                        block
                        onClick={() => {
                            setSelectedTable(tableNumber);
                            setSelectedTableOrders(groupedByTable[tableNumber]);
                            setShowModal(true);
                        }}
                    >
                        Table {tableNumber}
                    </Button>
                    </Col>
                ))
                ) : (
                <Col>
                    <p className="text-center">No orders found for today.</p>
                </Col>
                )}
            </Row>

            {/* Modal for displaying orders */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>
                    Orders for Table {selectedTable}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(selectedTableOrders).length > 0 ? (
                        Object.entries(selectedTableOrders).map(([dailyId, orders]) => {
                          const firstOrderTime = orders[0] ? new Date(orders[0].created_at).toLocaleTimeString() : '';
                          return (
                            <div key={dailyId}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>Order ID: {dailyId} - {firstOrderTime}</h4>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={async () => {
                                                const orderData = {
                                                    place: params.id,
                                                    table: selectedTable,
                                                    detail: orders.flatMap(order => JSON.parse(cleanDetailString(order.detail))),
                                                    isTakeAway: false,
                                                    phoneNumber: '',
                                                    comment: 'Reprint',
                                                    arrival_time:'',
                                                    customer_name: '',
                                                };
                                                const result = await reprintOrder(orderData, auth.token);
                                                if (result) {
                                                  alert("Reprint order sent!");
                                                }
                                            }}
                                        >
                                            Reprint
                                        </Button>
                                </div>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, orderIndex) => {
                                          const orderItems = Array.isArray(JSON.parse(cleanDetailString(order.detail)))
                                              ? JSON.parse(cleanDetailString(order.detail))
                                              : [];

                                          return (
                                              <React.Fragment key={orderIndex}>
                                                  {orderItems.map((item, itemIndex) => (
                                                  <tr key={`${orderIndex}-${itemIndex}`}>
                                                      <td>{item.name}</td>
                                                      <td>{item.quantity}</td>
                                                      <td>{order.status}</td>
                                                      <td>
                                                          {order.status === 'processing' && (
                                                          <Button
                                                              variant="success"
                                                              size="sm"
                                                              onClick={() => handleUpdateOrderStatus(selectedTable, dailyId)}
                                                          >
                                                              Mark as Done
                                                          </Button>
                                                          )}
                                                      </td>
                                                  </tr>
                                                  ))}
                                              </React.Fragment>
                                          );
                                          })}
                                      </tbody>
                                </Table>
                            </div>
                        );})
                    ) : (
                        <p>No orders for this table yet.</p>
                    )}
                </Modal.Body>
            </Modal>
        </MainLayout>
    );
};

export default Orders;
