import { IoMdArrowBack } from "react-icons/io";
import { Row, Col, Button, Table, Modal } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { fetchOrders, completeOrder, reprintOrder, fetchPlace } from "../apis";
import AuthContext from "../contexts/AuthContext";
import MainLayout from "../layouts/MainLayout";

const Orders = () => {
  const [place, setPlace] = useState(null);
  const [orders, setOrders] = useState([]);
  const currentDate = new Date();
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedTable, setSelectedTable] = useState(null); // State for selected table
  const [selectedTableOrders, setSelectedTableOrders] = useState({}); // State for selected table's orders
  const [reprintChecked, setReprintChecked] = useState({}); // new state

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
        const onFetchPlace = async () => {
            const json = await fetchPlace(params.id, auth.token);
            if (json) {
                setPlace(json);
            }
        };
    onFetchPlace();
  }, [params.id, auth.token]);


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
      alert(`桌号 ${tableNumber}, 订单号 ${dailyId} 已标记为已完成。`);
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
                <h3 className="mb-0 ml-2">今日订单</h3>
            </div>

            {/* Table Buttons */}
            <Row>
                {place ? (
                    place.tables.sort((a, b) => a.table_number - b.table_number).map((table) => (
                        <Col key={table.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                            <Button
                                variant={groupedByTable[table.table_number] ? "outline-primary" : "outline-secondary"}
                                block
                                onClick={() => {
                                    setSelectedTable(table.table_number);
                                    // Find orders for the selected table
                                    const ordersForTable = groupedByTable[table.table_number] || {};
                                    setSelectedTableOrders(ordersForTable);
                                    setShowModal(true);
                                }}
                                disabled={!groupedByTable[table.table_number]}
                            >
                                桌号 {table.table_number}
                            </Button>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p className="text-center">没有桌子。</p>
                    </Col>
                )}
            </Row>

      {/* Modal for displaying orders */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>桌号订单 {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(selectedTableOrders).length > 0 ? (
            Object.entries(selectedTableOrders)
              .sort(([, ordersA], [, ordersB]) => {
                // Handle cases where ordersA or ordersB might be undefined or empty
                const timeA = ordersA[0]
                  ? new Date(ordersA[0].created_at).getTime()
                  : 0;
                const timeB = ordersB[0]
                  ? new Date(ordersB[0].created_at).getTime()
                  : 0;
                return timeB - timeA;
              })
              .map(([dailyId, orders]) => {
                const firstOrderTime = orders[0]
                  ? new Date(orders[0].created_at).toLocaleTimeString()
                  : "";
                return (
                  <div key={dailyId}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4>
                        订单号: {dailyId} - {firstOrderTime}
                      </h4>
                      <Button
                        variant="info"
                        size="lg"
                        onClick={async () => {
                          // Prepare the order data for reprinting
                          const ordersToReprint = orders.filter(
                            (order) =>
                              reprintChecked[selectedTable]?.[dailyId]?.[
                                order.id
                              ] !== false
                          ); // Filter based on checkbox state

                          if (ordersToReprint.length === 0) {
                            alert("没有选中任何订单来重新打印。");
                            return;
                          }

                          const orderData = {
                            place: params.id,
                            table: selectedTable,
                            detail: ordersToReprint.flatMap((order) =>
                              JSON.parse(cleanDetailString(order.detail))
                            ),
                            isTakeAway: false,
                            phoneNumber: "",
                            comment: "Reprint",
                            arrival_time: "",
                            customer_name: "",
                            daily_id: dailyId,
                          };
                          const result = await reprintOrder(
                            orderData,
                            auth.token
                          );
                          if (result) {
                            alert("重打请求已发送！");
                          }
                        }}
                      >
                        重新打印
                      </Button>
                    </div>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>菜品名称</th>
                          <th>分类</th>
                          <th>数量</th>
                          <th>单价</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          )
                          .map((order, orderIndex) => {
                            const orderItems = Array.isArray(
                              JSON.parse(cleanDetailString(order.detail))
                            )
                              ? JSON.parse(cleanDetailString(order.detail))
                              : [];

                            return (
                              <React.Fragment key={order.id}>
                                {orderItems.map((item, itemIndex) => (
                                  <tr key={`${order.id}-${itemIndex}`}>
                                    <td>{item.name}</td>
                                    <td>{categoryMap[item.category]}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price}</td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        style={{ width: "20px", height: "20px" }}
                                        checked={
                                          reprintChecked[selectedTable]?.[
                                            dailyId
                                          ]?.[order.id] !== false
                                        }
                                        onChange={(e) => {
                                          setReprintChecked((prev) => ({
                                            ...prev,
                                            [selectedTable]: {
                                              ...(prev[selectedTable] || {}),
                                              [dailyId]: {
                                                ...(prev[selectedTable]?.[
                                                  dailyId
                                                ] || {}),
                                                [order.id]: e.target.checked,
                                              },
                                            },
                                          }));
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                );
              })
          ) : (
            <p>该桌还没有订单。</p>
          )}
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};

const categoryMap = {
    1: "Sushi",
    2: "寿司套餐",
    3: "中餐",
    4: "甜品",
    5: "饮料",
    6: "啤酒/酒",
    7: "水果酒",
    8: "红酒",
    9: "绿酒",
    10: "白酒",
    11: "粉红酒",
    12: "威士忌",
    13: "开胃酒",
    14: "咖啡"
};

export default Orders;
