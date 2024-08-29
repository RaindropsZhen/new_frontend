import { useParams, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { Modal, Container, Row, Col, Button, Tab, Tabs } from 'react-bootstrap';
import MultipleQRCode from '../components/MultipleQRCode';
import QRCode from '../components/QRCode';
import styled from 'styled-components';

import { 
    fetchPlace, 
    removePlace, 
    removeCategory, 
    removeMenuItem, 
    updatePlace,
    // deleteImage
  } from '../apis';

  import AuthContext from '../contexts/AuthContext';

  const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Responsive columns */
  gap: 16px; /* Space between grid items */
  padding: 20px;
`;

const QRCodePage = () => {
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

        <Container fluid style={{ padding: 20 }}>
            <h2 className="text-center">点餐二维码</h2>
            <Tabs 
                defaultActiveKey="MultipleQRCode" 
                id="qr-tabs"
                className="mb-3 qrcode-tab" /* Added custom class here */

                fill>

                <Tab eventKey="MultipleQRCode" title="多 二维码">
                    <div className="d-flex align-items-center mt-4 mb-4">
                        <h5 className="mb-0 mr-2">
                        总桌号 <b>{place.number_of_tables}</b>
                        </h5>
                    </div>

                    <GridContainer >
                        {Array.from({ length: place.number_of_tables }, (_, i) => i + 1).map((table) => (
                        <div 
                        key={table} 
                        className="grid-item"
                        >
                        <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h5> 桌号{table}</h5>
                        </Row>
                        
                        <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <MultipleQRCode table={table} placeId={place.id} />
                        </Row>
                        </div>
                        ))}
                    </GridContainer>
                </Tab>

                <Tab eventKey="uniqueQRCode" title="单 二维码">
                    <h5 className="mb-0 mr-2">
                    总桌号 <b>{place.number_of_tables}</b>
                    </h5>
                    <GridContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <QRCode placeId={place.id} />
                    </GridContainer>
                </Tab>
            </Tabs>

        </Container>
    );
  }
  
  export default QRCodePage;
  