import React from 'react';
import { Modal,Card } from 'react-bootstrap';

const PrintersModal = ({ show, onHide, place }) => {

  const printers = place && place.printers ? place.printers : [];
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: 'center', width: '100%' }}>打印机管理</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {printers.length > 0 ? (
            printers.map((printer, index) => (
              <div key={printer.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{index + 1}号打印机 </Card.Title>
                    <p>序列号: {printer.serial_number}</p>
                    <p style={{color: printer.printer_status === '1' ? 'green' : (printer.printer_status === '2' ? 'yellow' : 'red')}}>
                      在线状态: {printer.printer_status_info}</p>
                    <p>打印内容: {printer.category_name}</p>


                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p>无关联打印机</p>
          )}
        </div>

      </Modal.Body>
    </Modal>
  );
};

export default PrintersModal