import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Form, Spinner } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import AuthContext from '../contexts/AuthContext';
// import background_image from '../Assets/Images/backgroundImage.png';
// import { authentication } from '../firebase/firebase';
// import { signInWithPopup, GoogleAuthProvider, ProviderId } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    const auth = useContext(AuthContext);

    // Login with Google Account
    // const signInWithGoogle = () => {
    //     const provider = new GoogleAuthProvider();
    //     signInWithPopup(authentication,provider)
    //     .then((re)=>{
    //         console.log(re);
    //     })
    //     .catch((err)=>{
    //         console.log(err)
    //     })
    // }

    useEffect(() => {
        if (auth.token) {
            history.replace('/places');
        }
    });

    const onClick = () => {
        auth.signIn(email, password, () => history.replace("/places"));
    }

  //   const leftColumnStyle = {
  //     backgroundImage: `url(${background_image})`, // Use the imported image here
  //     backgroundSize: 'cover',
  //     backgroundPosition: 'center',
  //     minHeight: '100vh'
  // };
    const cardStyle = {
        padding: '40px',
        maxWidth: '400px',
        margin: '100px auto',
        backgroundColor: '#f7f7f7',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
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
                <Col>
                    <Card style={cardStyle}>
                        <Card.Body>
                            <h3 style={titleStyle}>
                                <b>LOGIN</b>
                            </h3>

                            <Form.Group>
                                <Form.Label>邮箱</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Enter Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
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
                                    "Sign In"
                                    )
                                }
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            {/* </Row> */}
        </MainLayout>
    )
}

export default Login;