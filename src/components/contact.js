import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { MdSmartphone,MdEmail } from "react-icons/md";
import { IoLogoWechat } from "react-icons/io5";

const ContactSection = () => {
  return (
    <Container>
      <Row className="justify-content-center my-4">
        <Col className="text-center">
          <h2 className='home-page-features-title-style'>联系我们</h2>
        </Col>
      </Row>

      <Row className="justify-content-center">
        {/* Phone Number Card */}
        <Col md={4} className="mb-4">
          <Card className='home-page-card w-100'>
            <Card.Body>
              <Card.Title> <MdSmartphone size="40"/> 电话号码</Card.Title>
              <Card.Text style={{ color: '#007bff', fontSize: '1.5em' }}>
                +351 938759828
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* Email Card */}
        <Col md={4} className="mb-4">
          <Card className='home-page-card w-100'>
            <Card.Body>
              <Card.Title> <MdEmail size="40"/> 邮箱</Card.Title>
              <Card.Text style={{ color: '#007bff', fontSize: '1.5em' }}>
                <a>qrmenufast@gmail.com</a>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* WeChat Card */}
        <Col md={4} className="mb-4">
          <Card className='home-page-card w-100'>
            <Card.Body>
              <Card.Title> <IoLogoWechat size="40"/> 微信</Card.Title>
              <Card.Text style={{ color: '#007bff', fontSize: '1.5em' }}>
                您的微信ID
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactSection;
