import { IoMdArrowBack } from "react-icons/io";
import { FiLink } from "react-icons/fi"; // Import Link icon
import { Row, Col, Button, Table, Modal, ToggleButton } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import React, { useState, useEffect, useContext, useCallback } from "react";
// import DropdownTableNumberPicker from "../components/DropdownTableNumberPicker"; // Commented out
import { fetchOrders, completeOrder, reprintOrder, fetchPlace, updateTableBlockedStatus } from "../apis"; // Removed updateTableNumberPeople
import AuthContext from "../contexts/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const [place, setPlace] = useState(null);
  // const [selectedNumbers, setSelectedNumbers] = useState({}); // Commented out
  const [orders, setOrders] = useState([]);
  const currentDate = new Date();
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTableOrders, setSelectedTableOrders] = useState({});
  const [reprintChecked, setReprintChecked] = useState({});

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

  const onFetchPlace = useCallback(async () => {
        const json = await fetchPlace(params.id, auth.token);
        if (json) {
            setPlace(json);
        }
    }, [params.id, auth.token]);

  useEffect(() => {
    onFetchPlace();
  }, [onFetchPlace]);

    // useEffect(() => { // Commented out - related to selectedNumbers
    //     if (place) {
    //         const initialSelectedNumbers = {};
    //         place.tables.forEach(table => {
    //             initialSelectedNumbers[table.id] = table.number_people || 1;
    //         });
    //         setSelectedNumbers(initialSelectedNumbers);
    //     }
    // }, [place]);

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

    useEffect(() => {
        if (showModal && selectedTable) {
          const ordersForTable = groupedByTable[selectedTable] || {};
          setSelectedTableOrders(ordersForTable);
        }
      }, [orders, showModal, selectedTable, groupedByTable]);

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

  const handleCompleteAllOrders = async (tableNumber) => {
    try {
      // Iterate through all dailyIds for the selected table
      for (const dailyId in groupedByTable[tableNumber]) {
        // Iterate through all orders for the current dailyId
        for (const order of groupedByTable[tableNumber][dailyId]) {
          // Update the status of each order to 'completed'
          await completeOrder(order.id, { status: 'completed' }, auth.token);
        }
      }
      // Re-fetch orders to update the UI
      await onFetchOrders();
      alert(`桌号 ${tableNumber} 的所有订单已标记为已完成。`);
    } catch (error) {
      console.error('Error updating all orders to completed:', error);
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
                            {console.log(table)}
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex align-items-stretch">
                                    <Button
                                        variant={groupedByTable[table.table_number] ? "outline-primary" : "outline-secondary"}
                                        block
                                        onClick={() => {
                                            setSelectedTable(table.table_number);
                                            const ordersForTable = groupedByTable[table.table_number] || {};
                                            setSelectedTableOrders(ordersForTable);
                                            setShowModal(true);
                                        }}
                                        disabled={table.blocked}
                                        className="flex-grow-1" // Make button take available space
                                    >
                                        {String(table.table_number) === "77" ? "VIP" : `桌号 ${table.table_number}`}
                                    </Button>
                                    <Button 
                                        variant="outline-info" 
                                        onClick={() => window.open(`/menu/0/${params.id}/${table.table_number}`, '_blank')}
                                        className="ms-1" // Margin start for spacing
                                        title={`打开桌号 ${table.table_number}的点餐链接`}
                                        style={{ padding: '0.375rem 0.5rem' }} // Adjust padding to match other small buttons
                                    >
                                        <FiLink size={18}/>
                                    </Button>
                                    {/* <div className="ms-1"> // Commented out DropdownTableNumberPicker wrapper
                                      <DropdownTableNumberPicker
                                          min={1}
                                          max={40}
                                        initialValue={selectedNumbers[table.id] || 1}
                                        onChange={(value) => {
                                          setSelectedNumbers(prev => ({ ...prev, [table.id]: value }));
                                          updateTableNumberPeople(table.id, value, auth.token)
                                            .then(response => {
                                              if (response) {
                                                toast.success(
                                                  `已更新桌号 ${table.table_number} 的人数为 ${value}`
                                                );
                                              }
                                            })
                                            .catch(error => {
                                              console.error("Error updating table number of people:", error);
                                              toast.error("更新人数失败");
                                            });
                                        }}
                                      />
                                    </div> */}
                                </div>
                            <ToggleButton
                                className="mb-2"
                                id={`toggle-check-${table.table_number}`}
                                type="checkbox"
                                variant="outline-warning"
                                value={table.table_number}
                                checked={table.blocked}
                                onChange={async (e) => {
                                  if (e.currentTarget) {
                                    const isChecked = e.currentTarget.checked;
                                    if (table) {
          await updateTableBlockedStatus(table.id, isChecked, auth.token);
          onFetchPlace(); // Refresh the place data after updating the blocked status
          toast.success(isChecked ? `桌号 ${table.table_number} 已封锁。` : `桌号 ${table.table_number} 已解除封锁。`);
        }
      }
    }}
>
    {table.blocked ? "解除封锁" : "封锁"}
</ToggleButton>
                            </div>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p className="text-center">没有桌子。</p>
                    </Col>
                )}
            </Row>

            {/* Modal for displaying orders */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                <Modal.Header closeButton>
                <Modal.Title>
                    {String(selectedTable) === "77" ? "桌号订单  VIP" : `桌号订单 ${selectedTable}`}
                  </Modal.Title>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    variant="success"
                    onClick={() => handleCompleteAllOrders(selectedTable)}
                  >
                    翻桌
                  </Button>

                </Modal.Header>
                <Modal.Body>
                    {Object.keys(selectedTableOrders).length > 0 ? (
                        (() => {
                          const filteredAndSortedOrders = Object.entries(selectedTableOrders)
                            .sort(([, ordersA], [, ordersB]) => {
                              const timeA = ordersA[0]?.created_at ? new Date(ordersA[0].created_at).getTime() : 0;
                              const timeB = ordersB[0]?.created_at ? new Date(ordersB[0].created_at).getTime() : 0;
                              return timeB - timeA;
                            });

                            return filteredAndSortedOrders.map(([dailyId, orders]) => {
                            const firstOrderTime = orders[0] ? new Date(orders[0].created_at).toLocaleTimeString() : "";

                            if (!orders.some((order) => order.status === "processing")) {
                              return null; // Don't render anything if no orders are in processing state
                            }

                            return (
                              <div key={dailyId}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <h4>订单号: {dailyId} - {firstOrderTime}</h4>
                                  <Button
                                    variant="info"
                                    
                                    onClick={async () => {
                                      // Prepare the order data for reprinting
                                      const ordersToReprint = orders.filter(
                                        (order) =>
                                          reprintChecked[selectedTable]?.[dailyId]?.[order.id] !== false &&
                                          order.status === "processing"
                                      ); // Filter based on checkbox state and order status

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
                                      const result = await reprintOrder(orderData, auth.token);
                                      if (result) {
                                        alert("重打请求已发送！");
                                      }
                                    }}
                                  >
                                    重新打印
                                  </Button>
                                  <Button
                                    variant="success"
                                    
                                    onClick={() => handleUpdateOrderStatus(selectedTable, dailyId)}
                                    disabled={!orders.some((order) => order.status === "processing")}
                                  >
                                    完成订单
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
                                      .filter((order) => order.status === "processing")
                                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                      .map((order, orderIndex) => {
                                        const orderItems = Array.isArray(JSON.parse(cleanDetailString(order.detail)))
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
                                                      reprintChecked[selectedTable]?.[dailyId]?.[order.id] !== false
                                                    }
                                                    onChange={(e) => {
                                                      setReprintChecked((prev) => ({
                                                        ...prev,
                                                        [selectedTable]: {
                                                          ...(prev[selectedTable] || {}),
                                                          [dailyId]: {
                                                            ...(prev[selectedTable]?.[dailyId] || {}),
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
                          });
                        })()
                    ) : (
                        <p>该桌还没有订单。</p>
                    )}
                </Modal.Body>
            </Modal>
            <ToastContainer />
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
