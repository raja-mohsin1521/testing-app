import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginFormContainer = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-in-out;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Arial', sans-serif;
`;

const StyledForm = styled(Form)`
  .form-group {
    margin-bottom: 20px;
  }
`;

const InputGroup = styled(Form.Group)`
  position: relative;
`;

const StyledInput = styled(Form.Control)`
  border-radius: 5px;
  border: 1px solid #ced4da;
  padding-left: 40px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #6c63ff;
    box-shadow: 0 0 5px rgba(108, 99, 255, 0.5);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c63ff;
`;

const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 5px;
  background-color: #6c63ff;
  border: none;
  padding: 10px;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a54d6;
  }
`;

const LoginPage = () => {
  const { loginTeacher, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/"); // Redirect if authenticated
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginTeacher({ email, password });
      setIsAuthenticated(true);
      navigate('/'); // Redirect after successful login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <Container fluid>
        <Row className="justify-content-center m-auto align-items-center" style={{ minHeight: '100vh' }}>
          <Col md={6} xs={12}>
            <LoginFormContainer>
              <Title>Login to Your Account</Title>
              <StyledForm onSubmit={handleSubmit}>
                <InputGroup controlId="formEmail">
                  <Icon><FaUser /></Icon>
                  <StyledInput
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
                <InputGroup controlId="formPassword">
                  <Icon><FaLock /></Icon>
                  <StyledInput
                    className="my-3"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                <StyledButton type="submit">Login</StyledButton>
              </StyledForm>
            </LoginFormContainer>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default LoginPage;
