import React from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { IoBuildSharp } from 'react-icons/io5';

const HomeHeader = () => {
  return (
    <Row>
      <Col md={6} className="my-auto">
        <h1 className='home-page-features-title-style'><b>数字化菜单</b></h1>
        <h5 className="mt-4 mb-4">
          一扫即达，顾客即刻获得丰富菜品信息，优化您的餐厅运营，提升顾客互动体验
        </h5>
        <Button href="/places" className='home-page-button-style' size="lg">
          <IoBuildSharp /> 创建二维码菜单
        </Button>
      </Col>
      <Col md={6}>
        <Image src="https://res.cloudinary.com/qrmenudemo/image/upload/v1703260846/qrmenu_photos/emvqfiil8eknmkwi7ffs.webp" rounded fluid />
      </Col>
    </Row>
  );
};

export default HomeHeader;
