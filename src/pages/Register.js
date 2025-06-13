import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import AuthContext from '../contexts/AuthContext';

// import background_image from '../Assets/Images/backgroundImage.png';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPassword_confirmation] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const history = useHistory();
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (auth.token) {
            history.replace('/places');
        }
    }, [auth.token, history]);

    const onClick = () => {
        // Pass the new fields to the register function
        auth.register(username, password, password_confirmation,email, phoneNumber, () => history.replace("/places"));
    }

    const cardStyle = {
      padding: '40px',
      maxWidth: '400px',
      margin: '100px auto',
      backgroundColor: '#f7f7f7',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center' // Center content vertically
  };
  

    const titleStyle = {
        fontSize: '24px',
        color: '#333',
        marginBottom: '30px',
        textAlign: 'center'
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px',
        border: 'none'
    };

    return (
        <MainLayout>
            {/* <Row style={leftColumnStyle}> */}
                    {/* Registration form */}
                    <Card style={cardStyle}>
                        <Card.Body>
                            <h3 style={titleStyle}>
                                <b>注册</b>
                            </h3>

                            <Form.Group>
                                <Form.Label>用户名</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="输入用户名" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>密码</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="输入密码" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>确认密码</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="再次输入密码" 
                                    value={password_confirmation} 
                                    onChange={(e) => setPassword_confirmation(e.target.value)} 
                                />
                            </Form.Group>

                            <Form.Group>
                            <Form.Label>邮箱</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="输入邮箱" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>电话号码</Form.Label>
                                <Form.Control 
                                    type="tel" 
                                    placeholder="电话号码" 
                                    value={phoneNumber} 
                                    onChange={(e) => setPhoneNumber(e.target.value)} 
                                />
                            </Form.Group>
                            <Button 
                                style={buttonStyle} 
                                block 
                                onClick={onClick} 
                                disabled={auth.loading}>
                                {auth.loading ? (
                                    <Spinner 
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    ) : (
                                    "Register"
                                    )
                                }
                            </Button>
                        </Card.Body>
                    </Card>
            {/* </Row> */}
        </MainLayout>
    )
}

export default Register