import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { MdQrCode2, MdOutlineSecurityUpdateGood, MdTableBar } from 'react-icons/md';
import { RiSpeedUpFill } from 'react-icons/ri';
import { IoPrintSharp } from 'react-icons/io5';

const MainFeatures = () => {
  return (
    <Container>
      <Row className="my-5 justify-content-center">
        <Col md={12} className="text-center">
          <h1 className='home-page-features-title-style'>主要特色</h1>
        </Col>
      </Row>

      <Row className="row-cols-1 row-cols-md-3 g-4 mb-2">
        {/* Card for 扫码即点 */}
        <Col className="d-flex">
          <Card className='home-page-card w-100 d-flex flex-column'>
            <Card.Body>
              <Card.Title><MdQrCode2 size="40"/> 扫码即点</Card.Title>
              <Card.Text>
                客人无需下载任何应用，只需扫描餐桌上的二维码即可轻松点餐。
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Card for 易于管理 */}
        <Col className="d-flex">
          <Card className='home-page-card w-100 d-flex flex-column'>
            <Card.Body>
              <Card.Title><MdOutlineSecurityUpdateGood size="40"/> 菜单管理</Card.Title>
              <Card.Text>
                简单直观的在线菜单管理功能。
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Card for 餐桌管理 */}
        <Col className="d-flex">
          <Card className='home-page-card w-100 d-flex flex-column'>
            <Card.Body>
              <Card.Title><MdTableBar size="40"/> 餐桌管理</Card.Title>
              <Card.Text>
                每个餐桌都有独立的二维码，方便快捷。
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="row-cols-1 row-cols-md-3 g-4 mb-3">
        {/* Card for 多语言支持 */}
        <Col className="d-flex">
          <Card className='home-page-card w-100 d-flex flex-column'>
            <Card.Body>
              <Card.Title><RiSpeedUpFill size="40"/> 多语言支持</Card.Title>
              <Card.Text>
                自动翻译菜单，支持英语,葡萄牙语以及西班牙语
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Card for 提高效率 */}
        <Col className="d-flex">
          <Card className='home-page-card w-100 d-flex flex-column'>
            <Card.Body>
              <Card.Title><RiSpeedUpFill size="40"/> 提高效率</Card.Title>
              <Card.Text>
                客人可以自助点餐，而服务员则可以专注于提供更优质的服务。
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Card for 小票打印 */}
        <Col className="d-flex">
          <Card className='home-page-card w-100 d-flex flex-column'>
            <Card.Body>
              <Card.Title><IoPrintSharp size="40"/> 小票打印</Card.Title>
              <Card.Text>
                支持打印功能，或可直接在网页上浏览订单
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </Container>
  );
};

export default MainFeatures;
