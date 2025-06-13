import React, { useState,useContext } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import ColorPickerComponent from "./ColorPicker";
import CustomQRCode from "./CustomQRCode";
import { updatePlace} from "../apis";
import AuthContext from '../contexts/AuthContext';
import { uploadImage } from "../apis";  
import { ToastContainer, toast } from 'react-toastify';

const ModifyQRCode = ({ place,dotColor, cornersDotColor, cornersSquareColor, backgroundColorleft, backgroundColorright }) => {
  const [showModal, setShowModal] = useState(false);
  const [Newimage,setNewimage] = useState(place.image)
  const [NewdotsColor, setNewdotsColor] = useState(dotColor);
  const [NewcornersDotColor, setNewCornersDotColor] = useState(cornersDotColor);
  const [NewcornersSquareColor, setNewcornersSquareColor] = useState(cornersSquareColor);
  const [NewbackgroundColorleft, setNewbackgroundColorleft] = useState(backgroundColorleft);
  const [NewbackgroundColorright, setNewbackgroundColorright] = useState(backgroundColorright);
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  const handleImageChange = (e) => {
    setNewimage(e.target.files[0]); // Get the selected image file
  };

  const onUpdatePlace = async () => {
    setLoading(true);
    let folder_name = auth.token;

    const image_json = await uploadImage(Newimage, folder_name)
    const json = await updatePlace(
      place.id, 
      {
        dotsColor: NewdotsColor,
        cornersDotColor: NewcornersDotColor,
        cornersSquareColor: NewcornersSquareColor,
        backgroundColorleft:NewbackgroundColorleft,
        backgroundColorright: NewbackgroundColorright,
        image: image_json.url
      },
       auth.token);

      if (json.id) {
        toast.success('成功更新二维码', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000, // Close the notification after 2 seconds (adjust as needed)
        });
      } else{
        toast.error('更新失败，请稍后再试', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
  }

  const handleConfirm = () => {
    // onChange(color); // Call the provided onChange callback with the selected color
    onUpdatePlace()
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Button
        style={{
          marginBottom: "10px",
          fontSize: "1.3rem",
          padding: "0.5rem",
          width: "200px",
          height: "50px",
        }}
        variant="standard"
        onClick={handleOpenModal} // Use a reference without parentheses
        className="mr-2"
      >
        点击更改二维码样式
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg" // Increase the size of the modal
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>自定义颜色</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <CustomQRCode
              place={place}
              dotColor={NewdotsColor}
              cornersDotColor={NewcornersDotColor}
              cornersSquareColor={NewcornersSquareColor}
              backgroundColorleft={NewbackgroundColorleft}
              backgroundColorright={NewbackgroundColorright}
              >
              </CustomQRCode>
            </Col>
            <Col md={6}>
              <h4>更改颜色</h4>
              <ColorPickerComponent color={NewdotsColor} onChange={setNewdotsColor} />
              <h4>更改边缘方块颜色</h4>
              <ColorPickerComponent color={NewcornersDotColor} onChange={setNewCornersDotColor} />
              <h4>更改边缘方块外围颜色</h4>
              <ColorPickerComponent color={NewcornersSquareColor} onChange={setNewcornersSquareColor} />
              <h4>更改左上角渐变色</h4>
              <ColorPickerComponent color={NewbackgroundColorleft} onChange={setNewbackgroundColorleft} />
              <h4>更改右下角渐变色</h4>
              <ColorPickerComponent color={NewbackgroundColorright} onChange={setNewbackgroundColorright} />
                {/* Image Selector */}
              <div>
                <h4>选择图片</h4>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </Col>
          </Row>
          <Row className="ml-5"><b>点击确认之后需要刷新页面才能显示最新二维码！</b></Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Row>
            <Button className="mr-4 btn-lg" variant="standard" onClick={handleConfirm}>
              确认
            </Button>
            <Button  className="mr-4 btn-lg" variant="secondary" onClick={handleCloseModal}>
              取消
            </Button>
          </Row>

        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModifyQRCode;
