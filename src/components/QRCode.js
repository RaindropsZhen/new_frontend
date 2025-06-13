import { AiOutlineLink } from 'react-icons/ai';
import { Button } from 'react-bootstrap';
import QRCodeReact from 'qrcode.react';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  > div {
    margin: auto;
  }
`;

const QRCode = (placeId) => {
  const url = `${window.location.origin}/${placeId.placeId}/select_table`;

  return (
    <Container>
      <QRCodeReact value={url} size={200} />

      <Overlay>
        <div className="d-flex" >
          <Button variant="standard" href={url} target="_blank">
            <AiOutlineLink size={25}/> 链接 
          </Button>
        </div>  
      </Overlay>
    </Container>
  )
}

export default QRCode;
