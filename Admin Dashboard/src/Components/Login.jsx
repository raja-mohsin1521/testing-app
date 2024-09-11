import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s ease-out;
`;

const StyledForm = styled(Form)`
  background-color: #f8f9fa;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.7s ease-out;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StyledButton = styled(Button)`
  background-color: #6c63ff;
  border: none;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #5a54d6;
  }
`;

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <StyledContainer>
      <Row>
        <Col xs={12}>
          <StyledForm onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Login</h3>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <StyledButton type="submit" className="w-100 mt-4">
              Submit
            </StyledButton>
          </StyledForm>
        </Col>
      </Row>
    </StyledContainer>
  );
};

export default Login;
