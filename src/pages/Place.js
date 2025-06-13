import { AiOutlineQrcode } from 'react-icons/ai';
import { RiFileList3Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi'; // Icon for Edit Place
import { Row, Col, Button, Modal } from 'react-bootstrap'; // Added Modal
import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import AuthContext from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';
import {fetchPlace} from '../apis'; // Removed trailing comma
import EditPlace from '../components/EditPlace'; // Import EditPlace component

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
  const [place, setPlace] = useState(null); // Initialize with null
  const [showEditPlaceModal, setShowEditPlaceModal] = useState(false);
  
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
              <Button variant="link" onClick={() => { history.push(`/places/${params.id}/settings`) }}>
                <IoSettingsOutline size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>菜单管理</div>
              </Button>

              <Button variant="link" onClick={() => setShowEditPlaceModal(true)}>
                <FiEdit size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>店铺设置</div>
              </Button>

              <Button variant="link" onClick={() => { history.push(`/${params.id}/select_table/`) }}>
                <AiOutlineQrcode size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>点单链接</div>
              </Button>

              <Button variant="link" onClick={() => { history.push(`/places/${params.id}/orders`) }}>
                <RiFileList3Line size={50} style={{ color: '#444', lineHeight: 0, padding: 0, margin: 0 }} />
                <div style={{ fontSize: '24px', marginTop: '5px' }}>今日订单</div>
              </Button>
            </ButtonGrid>
          </div>
        </Col>

      </Row>

      {place && (
        <Modal show={showEditPlaceModal} onHide={() => setShowEditPlaceModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>编辑店铺信息 - {place.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditPlace 
              place={place} 
              onDone={() => {
                setShowEditPlaceModal(false);
                onFetchPlace(); // Refresh place data after editing
              }} 
            />
          </Modal.Body>
        </Modal>
      )}
    </MainLayout>
  )
};

export default Place;
