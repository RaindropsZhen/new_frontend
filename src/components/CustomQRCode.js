import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Col, Row, Button } from 'react-bootstrap';

const CustomQRCode = ({ place, dotColor, cornersDotColor, cornersSquareColor, backgroundColorleft, backgroundColorright }) => {
  const qrCodeRef = useRef(null);
  const qrCodeInstance = useRef(null);

  const url = `${window.location.origin}/${place.id}/select_table`;

  useEffect(() => {
    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 300,
        height: 300,
        image: place.image,
        dotsOptions: {
          color: dotColor,
          type: "square"
        },
        cornersDotOptions: {
          color: cornersDotColor,
          type: 'square'
        },
        cornersSquareOptions: {
          color: cornersSquareColor,
          type: 'extra-rounded'
        },
        backgroundOptions: {
          color: 'blue',
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [{ offset: 0, color: backgroundColorleft }, { offset: 1, color: backgroundColorright }]
          }
        },
        gradient: 100,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10,
          size: 1000,
        },
        data: url
      });
      qrCodeInstance.current.append(qrCodeRef.current);
    } else {
      // If qrCodeInstance already exists, update the options
      qrCodeInstance.current.update({
        dotsOptions: {
          color: dotColor,
          type: "square"
        },
        cornersDotOptions: {
          color: cornersDotColor,
          type: 'square'
        },
        cornersSquareOptions: {
          color: cornersSquareColor,
          type: 'extra-rounded'
        },
        backgroundOptions: {
          color: 'blue',
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [{ offset: 0, color: backgroundColorleft }, { offset: 1, color: backgroundColorright }]
          }
        }
      });
    }
  }, [dotColor, cornersDotColor, cornersSquareColor, backgroundColorleft, backgroundColorright, place.image]);

  const [fileExt, setFileExt] = useState("png");

  const onExtensionChange = (event) => {
    setFileExt(event.target.value);
  };

  const onDownloadClick = () => {
    qrCodeInstance.current.download({
      extension: fileExt
    });
  };

  return (
    <Col>
      <div ref={qrCodeRef} />

      <Row className="justify-content-center mb-3 mt-3">
        <select
          style={{
            marginRight: '10px',
            fontSize: '1.3rem',
            padding: '0.5rem',
            width: '100px',
            height: '50px'
          }}
          onChange={onExtensionChange}
          value={fileExt}
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
        <Button
          style={{
            marginRight: '10px',
            fontSize: '1.3rem',
            padding: '0.5rem',
            width: '200px',
            height: '50px'
          }}
          variant="standard"
          onClick={onDownloadClick}
        >
          点击下载二维码
        </Button>
      </Row>
      <b>注：PNG为高清版，JPEG为标清</b>
    </Col>
  );
};

export default CustomQRCode;
