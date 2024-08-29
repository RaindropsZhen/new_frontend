import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { RiMoneyEuroBoxFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { CgSmartHomeWashMachine } from "react-icons/cg";

const SubscriptionCard = () => {
  return (
    <Container>
        <Row className="justify-content-center my-4">
            <Col className="text-center">
            <h2 className='home-page-features-title-style'>会员费用(2选1)</h2>
            </Col>
        </Row>
        <Row>
            <Col>
                <Card className='home-page-card w-100'>
                    <Card.Body>
                        <Card.Title> <RiMoneyEuroBoxFill size="40"/>6个月会员</Card.Title>
                        <Card.Text style={{ color: '#007bff', fontSize: '1.5em' }}>
                            {70.99}€/月
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            
            <Col>
                <Card className='home-page-card w-100'>
                    <Card.Body>
                        <Card.Title> <RiMoneyEuroBoxFill size="40"/>12个月会员</Card.Title>
                        <Card.Text style={{ color: '#007bff', fontSize: '1.5em' }}>
                            {59.99}€/月
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        <Row className="justify-content-center mt-3 mb-3">
            <Col className="justify-content-center align-items-center mt-3 mb-3">
                <Row className="justify-content-center mt-3 mb-3">
                    <FaPlus style={{ color: '#007bff'}} size="80"/>
                </Row>
            </Col>
            <Col className="justify-content-center align-items-center mt-3 mb-3">
                <Row className="justify-content-center mt-3 mb-3">
                    <FaPlus style={{ color: '#007bff'}} size="80"/>
                </Row>
            </Col>
        </Row> 

        <Row className='mb-4'>
            <Col>
                <Card className='home-page-card w-100'>
                    <Card.Body>
                        <Card.Title><CgSmartHomeWashMachine size="40"/>无线厨房小票机器(可选项)</Card.Title>
                        <Card.Text style={{ color: '#007bff', fontSize: '1.5em' }}>
                            {50.99}€
                        </Card.Text>
                        (一次性费用)
                    </Card.Body>
                </Card>
            </Col>
            
            <Col>
                <Card className='home-page-card w-100'>
                    <Card.Body>
                    <Card.Title><CgSmartHomeWashMachine size="40"/>无线厨房小票机器(可选项)</Card.Title>
                        <Card.Text style={{ color: '#007bff', fontSize: '1.5em' }}>
                            {40.99}€
                        </Card.Text>
                        (一次性费用)
                    </Card.Body>
                </Card>
            </Col>
        </Row>

    </Container>
  );
};

export default SubscriptionCard;
