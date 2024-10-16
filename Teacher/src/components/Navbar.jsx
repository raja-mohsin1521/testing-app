import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import styled from "styled-components";
import { FaSun, FaMoon } from 'react-icons/fa';

const StyledNavbar = styled(Navbar)`
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#1e1e2f' : '#2c3e50')}; /* Dark background */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  transition: background-color 0.3s, box-shadow 0.3s;
  position: sticky;
  top: 0;
  z-index: 1000;

  &:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#2c3e50' : '#34495e')}; /* Slightly lighter on hover */
    box-shadow: 0 6px 35px rgba(0, 0, 0, 0.25);
  }

  .navbar-brand {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${({ isDarkMode }) => (isDarkMode ? '#ecf0f1' : '#ffffff')};
    transition: color 0.3s;

    &:hover {
      color: #f39c12; /* Highlight brand on hover */
    }
  }

  .nav-link {
    color: ${({ isDarkMode }) => (isDarkMode ? '#ecf0f1' : '#ffffff')};
    font-size: 1.2rem;
    margin: 0 1rem;
    transition: color 0.3s, transform 0.2s;

    &:hover {
      color: #f39c12; /* Highlight links on hover */
      transform: translateY(-2px);
    }
  }

  .btn-outline-light {
    border-color: ${({ isDarkMode }) => (isDarkMode ? '#bdc3c7' : '#ffffff')};
    color: ${({ isDarkMode }) => (isDarkMode ? '#bdc3c7' : '#ffffff')};
    transition: background-color 0.3s, color 0.3s;
    padding: 0.5rem 1rem;
    border-radius: 30px; /* Rounded corners */
    font-size: 1rem;

    &:hover {
      background-color: ${({ isDarkMode }) => (isDarkMode ? '#2c3e50' : '#ffffff')};
      color: ${({ isDarkMode }) => (isDarkMode ? '#ffffff' : '#2c3e50')};
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: 768px) {
    .nav-link {
      margin: 0.5rem 0;
      font-size: 1rem;
    }

    .btn-outline-light {
      font-size: 0.9rem;
    }
  }
`;

const NavbarComponent = ({ toggleDarkMode, isDarkMode,setIsLoggedIn }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
  
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <StyledNavbar expand="lg" isDarkMode={isDarkMode}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Teacher Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/questions">Questions</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={toggleDarkMode} className="me-2">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </Button>
          <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default NavbarComponent;
