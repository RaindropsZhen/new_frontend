import { AiOutlineQrcode } from 'react-icons/ai';
import { RiFileList3Line } from 'react-icons/ri';
import { Row, Col, Button} from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { RiEBike2Fill } from "react-icons/ri";
import { TiPrinter } from "react-icons/ti";
import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';
import {fetchPlace,} from '../apis';

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  padding: 10px;
  box-sizing: border-box;
  justify-items: stretch;

  & > button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    background-color: #f8f9fa;
    height: 100%;
    padding: 10px;
    transition: background-color 0.3s ease;
    border: 1px solid #ddd;

    &:hover {
      background-color: #e2e6ea;
      cursor: pointer;
    }
  }
`;

const Place = () => {
  const [place, setPlace] = useState({});
  
  const auth = useContext(AuthContext);
  const params = useParams();
  const history = useHistory();

  const onFetchPlace = async () => {
    const json = await fetchPlace(params.id, auth.token);
    if (json) {
      setPlace(json);
    }
  };

  useEffect(() => {
    onFetchPlace();
  }, []);

  return (
    <MainLayout>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>管理界面</h1>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={6}>
          <div className="mb-4">
            <ButtonGrid>
              <Button variant="link" onClick={() => { history.push(`/${params.id}/select_table/`) }}>
                <AiOutlineQrcode size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>点单链接</div>
              </Button>

              <Button variant="link" onClick={() => { history.push(`/places/${params.id}/orders`) }}>
                <RiFileList3Line size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>今日订单</div>
              </Button>

              <Button variant="link" >
                <RiEBike2Fill size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>外卖订单</div>
              </Button>

              <Button variant="link" >
                <TiPrinter size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>打印机</div>
              </Button>
            </ButtonGrid>
          </div>
        </Col>

      </Row>
    </MainLayout>
  )
};

export default Place;
