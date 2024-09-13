import React, { useState } from 'react';
import { Button, Col, Row, Nav  } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${(props) => (props.open ? '200px' : '0')};
  height: 100vh;
  overflow: hidden;
  background-color: #343a40;
  transition: width 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 745px) {
    position: absolute;
    top: 0;
    left: ${(props) => (props.open ? '0' : '-200px')};
    z-index: 2;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 300px;
  left: ${(props) => (props.open ? '180px' : '0')};
  background-color: #343a40;
  z-index: 3;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  transition: left 0.3s ease-in-out;

  &:hover {
    background-color: #495057;
  }

  @media (min-width: 746px) {
    display: none;
  }
`;

const StyledNav = styled(Nav)`
  flex-direction: column;
  height: 100%;
  padding-top: 60px;
  flex-grow: 1; /* Allows the navigation content to grow */
`;

const StyledNavLink = styled(Link)`
  color: ${(props) => (props.active ? '#ffc107' : '#fff')};
  padding: 15px 20px;
  text-decoration: none;

  &:hover {
    background-color: #495057;
    color: #ffc107;
  }
`;

const BottomButtonRow = styled(Row)`
  margin-top: auto; /* Push the button to the bottom */
  padding-bottom: 20px;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    
    navigate('/login'); 
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar} open={isOpen}>
        <FaBars />
      </ToggleButton>
      <SidebarContainer open={isOpen}>
        <StyledNav>
          <h3 className="text-white  mx-3">Admin Panel</h3>
          <StyledNavLink to="/" active={location.pathname === '/'}>
            Dashboard
          </StyledNavLink>
          <StyledNavLink to="/test-centers" active={location.pathname === '/test-centers'}>
            Test Centers
          </StyledNavLink>
          <StyledNavLink to="/students" active={location.pathname === '/students'}>
            Students
          </StyledNavLink>
          <StyledNavLink to="/teachers" active={location.pathname === '/teachers'}>
            Teachers
          </StyledNavLink>
          <StyledNavLink to="/scheduled-tests" active={location.pathname === '/scheduled-tests'}>
            Scheduled Tests
          </StyledNavLink>
          <StyledNavLink to="/papers" active={location.pathname === '/papers'}>
            Papers
          </StyledNavLink>
          <StyledNavLink to="/requests" active={location.pathname === '/requests'}>
            Requests
          </StyledNavLink>
          <StyledNavLink to="/complains" active={location.pathname === '/complains'}>
            Complains
          </StyledNavLink>

          <BottomButtonRow className="text-center">
            <Col>
              <Button className="btn-dark w-50 " onClick={handleLogout} >Logout</Button>
            </Col>
          </BottomButtonRow>
        </StyledNav>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
