import React from 'react';
import { Modal, Tab, Tabs, Button,Container } from 'react-bootstrap';
import QRCodeTakeAway from './QRCodeTakeAway';
import TakeAwayCustomQRCode from './TakeAwayCustomQRCode';
import ModifyQRCode from './ModifyQRCode';

const QRCodeModalTakeAway = ({ show, onHide, place }) => (
  <Modal show={show} onHide={onHide} size="lg" centered>

    <Modal.Body className="text-center pt-4">
      <Container>
        <h3>外卖点单二维码</h3>
          <Tabs
          defaultActiveKey="normalQRCode" 
          id="qr-tabs"
          className="mb-3"
          fill>
            <Tab eventKey="normalQRCode" title="黑白二维码">
              <QRCodeTakeAway placeId = {place.id}/>
            </Tab>
            <Tab eventKey="CustomQRCode" title="自定义二维码">
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
              <TakeAwayCustomQRCode 
                place={place}
                dotColor={place.dotsColor}
                cornersDotColor={place.cornersDotColor}
                cornersSquareColor={place.cornersSquareColor}
                backgroundColorleft={place.backgroundColorleft}
                backgroundColorright={place.backgroundColorright}
              />  
            </Tab>
          </Tabs>
        </Container>
    </Modal.Body>
  </Modal>
);

export default QRCodeModalTakeAway;