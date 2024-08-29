import React, { useState } from 'react';
import { Modal, Container, Row, Col, Button, Tab, Tabs } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling
import CustomQRCode from './CustomQRCode';
import ModifyQRCode from './ModifyQRCode';
import QRCode from './QRCode';

import MultipleQRCode from './MultipleQRCode';
import MultipleCustomQRCode from './MultipleCustomQRCode';

const QRCodeModal = ({ show, onHide, place, onUpdatePlace }) => {
  const [tableNumber, setTableNumber] = useState(1); // Initialize with the default value
  const numberOptions = Array.from({ length: 300 }, (_, index) => index + 1);

  const handleNumberChange = (value) => {
    setTableNumber(value);
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Body className="text-center pt-4">
        <Container>
          <h2>点餐二维码</h2>
          <Tabs 
          defaultActiveKey="modify" 
          id="qr-tabs"
          className="mb-3"
          fill>
            <Tab eventKey="empty" title="黑白二维码">
              <Tabs defaultActiveKey="uniqueQRCode" id="subtabs" fill>
                <Tab eventKey="uniqueQRCode" title="单 二维码">
                  <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
                    <h5 className="mb-0 mr-2">
                      总桌号 <b>{place.number_of_tables}</b>
                    </h5>
                  </div>
                  <QRCode placeId={place.id} />
                </Tab>

                <Tab eventKey="MultipleQRCode" title="多 二维码">
                  <div className="d-flex align-items-center mt-4 mb-4">
                    <h5 className="mb-0 mr-2">
                      总桌号 <b>{place.number_of_tables}</b>
                    </h5>
                  </div>

                  <Row>
                    {Array.from({ length: place.number_of_tables }, (_, i) => i + 1).map(
                      (table) => (
                        <Col key={table} lg={4} md={6} className="mb-4">
                          <h5> 桌号{table}</h5>
                          <MultipleQRCode table={table} placeId={place.id} />
                        </Col>
                      )
                    )}
                  </Row>
                </Tab>
              </Tabs>
            </Tab>

            <Tab eventKey="modify" title="自定义彩色二维码">
              <Tabs defaultActiveKey="uniqueQRCode" id="subtabs" fill>
                  <Tab eventKey="uniqueQRCode" title="单 二维码">
                    <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
                      <h5 style={{ marginRight: '1rem' }}>
                        餐桌数量 <b>{place.number_of_tables}</b>
                      </h5>
                    </div>
                    <ModifyQRCode
                      place={place}
                      dotColor={place.dotsColor}
                      cornersDotColor={place.cornersDotColor}
                      cornersSquareColor={place.cornersSquareColor}
                      backgroundColorleft={place.backgroundColorleft}
                      backgroundColorright={place.backgroundColorright}
                    />
                    <CustomQRCode 
                      place={place}
                      dotColor={place.dotsColor}
                      cornersDotColor={place.cornersDotColor}
                      cornersSquareColor={place.cornersSquareColor}
                      backgroundColorleft={place.backgroundColorleft}
                      backgroundColorright={place.backgroundColorright}
                    />
                  </Tab>
                  <Tab eventKey="MultipleQRCode" title="多 二维码">
                    <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
                        <h5 style={{ marginRight: '1rem' }}>
                          餐桌数量 <b>{place.number_of_tables}</b>
                        </h5>
                    </div>
                    <ModifyQRCode
                      place={place}
                      dotColor={place.dotsColor}
                      cornersDotColor={place.cornersDotColor}
                      cornersSquareColor={place.cornersSquareColor}
                      backgroundColorleft={place.backgroundColorleft}
                      backgroundColorright={place.backgroundColorright}
                    />

                    <Row>
                      {Array.from({ length: place.number_of_tables }, (_, i) => i + 1).map(
                        (table, index) => (
                          <Col key={table} lg={6} className="mb-4">
                            <h5>桌号 {table}</h5>
                            <MultipleCustomQRCode
                              place={place}
                              dotColor={place.dotsColor}
                              cornersDotColor={place.cornersDotColor}
                              cornersSquareColor={place.cornersSquareColor}
                              backgroundColorleft={place.backgroundColorleft}
                              backgroundColorright={place.backgroundColorright}
                              table={table}
                            />
                          </Col>
                        )
                      )}
                    </Row>



                  </Tab>
                </Tabs>
                
            </Tab>
          </Tabs>
          <Row className="d-flex align-items-center justify-content-center mt-4">
            <select
              onChange={(e) => handleNumberChange(e.target.value)}
              style={{
                fontSize: '1.3rem',
                padding: '0.5rem',
                width: '100px',
                height: '50px' 
              }} 
            >
              {numberOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button 
              style={{
                fontSize: '1.3rem',
                padding: '0.5rem',
                width: '200px',
                height: '50px'
              }}
              variant="standard"
              onClick={() => onUpdatePlace(tableNumber)} // Use an arrow function here
              className="ml-2"
            >
              点击更新餐桌数量
            </Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default QRCodeModal;
