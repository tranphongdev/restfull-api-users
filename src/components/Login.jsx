import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ApiServices from '../services/ApiServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        toast.promise(
            ApiServices.ApiLogin(email, password)
                .then((response) => {
                    if (response && response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        navigate('/');
                    } else {
                        toast.error('Login failed: Invalid response from server');
                    }
                })
                .catch((error) => {
                    console.error('Login failed:', error);
                    throw new Error('Failed to login');
                }),
            {
                pending: 'Logging in...',
                success: 'Login successful!',
                error: 'Login failed: Invalid credentials or server error',
            },
        );
    };

    return (
        <Container className="col-sm-4 col-12 my-5">
            <h3 className="text-center">Login</h3>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address (eve.holt@reqres.in)</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password (cityslicka)</Form.Label>
                    <Form.Control
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    );
}

export default Login;
