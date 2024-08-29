import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { fetchOrders } from '../../apis';
import MainLayout from '../../layouts/MainLayout';
import { Row } from 'react-bootstrap';

const Analysis = () => {
  const params = useParams();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const onFetchOrders = async () => {
      const json = await fetchOrders(params.id, auth.token);
      if (json) {
        setOrders(json);
      }
    };

    onFetchOrders();
  }, [params.id, auth.token]);

  // Extract 'name' field from 'detail' for each order
  const orderNames = orders.map((order) => {
    const detail = JSON.parse(order.detail);
    if (detail && detail.length > 0) {
      return detail[0].name; // Assuming you want the name of the first item in 'detail'
    }
    return 'N/A'; // If 'detail' is empty or not valid
  });

  const categoryNames = orders.map((order) => {
    const detail = JSON.parse(order.detail);
    if (detail && detail.length > 0) {
      return detail[0].category; // Assuming you want the name of the first item in 'detail'
    }
    return 'N/A'; // If 'detail' is empty or not valid
  });

  return (
    <MainLayout>
      <Row style={{ marginBottom: '20px', marginTop: '20px' }}>
        <button style={{ marginRight: '10px' }} onClick={() => history.goBack()}>返回</button>
        <h1 style={{ marginBottom: '10px' }}>历史数据分析</h1>
      </Row>

      {/* Display names extracted from 'detail' for each order */}
      <div>
        <h2>Names from 'detail' for each order:</h2>
        <ul>
          {orderNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
        <p>{categoryNames}</p>
      </div>
    </MainLayout>
  );
};

export default Analysis;
