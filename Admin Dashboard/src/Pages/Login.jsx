import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
import { updateAdminPassword, adminLogin } from '../Hooks/useCredentials'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for show/hide password

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

const InputGroup = styled(Form.Group)`
  position: relative;
`;

const PasswordToggleIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 35px;
  cursor: pointer;
`;

const LoginAndUpdatePassword = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin(email, password);
      localStorage.setItem('authToken', response.token); // Store token in local storage
      alert('Login successful!');
      navigate('/'); // Redirect after successful login
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      await updateAdminPassword(email, newPassword); // Send email with new password
      alert('Password updated successfully!');
      navigate('/'); // Redirect after successful update
    } catch (error) {
      console.error('Update password error:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  return (
    <StyledContainer>
      <Row>
        <Col xs={12}>
          {isUpdating ? (
            <StyledForm onSubmit={handleUpdatePassword}>
              <h3 className="text-center mb-4">Update Password</h3>
              <InputGroup controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required // Make email required
                />
              </InputGroup>

              <InputGroup controlId="formCurrentPassword" className="mt-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control 
                  type={showCurrentPassword ? 'text' : 'password'} 
                  placeholder="Enter current password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  required // Make current password required
                />
                <PasswordToggleIcon onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggleIcon>
              </InputGroup>

              <InputGroup controlId="formNewPassword" className="mt-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control 
                  type={showNewPassword ? 'text' : 'password'} 
                  placeholder="Enter new password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required // Make new password required
                />
                <PasswordToggleIcon onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggleIcon>
              </InputGroup>

              <InputGroup controlId="formConfirmPassword" className="mt-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Confirm new password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required // Make confirm password required
                />
                <PasswordToggleIcon onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggleIcon>
              </InputGroup>

              <StyledButton type="submit" className="w-100 mt-4">
                Update Password
              </StyledButton>
              <Button variant="link" onClick={() => setIsUpdating(false)} className="mt-3">Back to Login</Button>
            </StyledForm>
          ) : (
            <StyledForm onSubmit={handleLogin}>
              <h3 className="text-center mb-4">Login</h3>
              <InputGroup controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required // Make email required
                />
              </InputGroup>

              <InputGroup controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required // Make password required
                />
                <PasswordToggleIcon onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggleIcon>
              </InputGroup>

              <StyledButton type="submit" className="w-100 mt-4">
                Login
              </StyledButton>
              <Button variant="link" onClick={() => setIsUpdating(true)} className="mt-3">Update Password</Button>
            </StyledForm>
          )}
        </Col>
      </Row>
    </StyledContainer>
  );
};

export default LoginAndUpdatePassword;
