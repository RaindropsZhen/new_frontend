import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { Modal, Button } from "react-bootstrap";

const ColorPickerComponent = ({ onChange }) => {
  const [color, setColor] = useState('#4267b2'); // Initial color
  const [showModal, setShowModal] = useState(false);

  const handleColorChange = (value) => {
    setColor(value.hex); // Update the current color
  };

  const handleConfirm = () => {
    onChange(color); // Call the provided onChange callback with the selected color
    handleSettingCloseModal();
  };

  const handleSettingCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: color,
          width: "100px",
          height: "30px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
        onClick={handleOpenModal}
      >
      </Button>
      <Modal show={showModal} onHide={handleSettingCloseModal} centered>
        <Modal.Header closeButton>
            <Modal.Title>自定义颜色</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha
            width="400px"
            height="300px"
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
        <Button variant="standard" onClick={handleConfirm}>
            确认
        </Button>
        <Button variant="secondary" onClick={handleSettingCloseModal}>
            取消
        </Button>
        </Modal.Footer>

      </Modal>
    </div>
  );
};

export default ColorPickerComponent;
