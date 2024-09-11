import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
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
    position: absolute; /* Make sidebar float over content */
    top: 0;
    left: ${(props) => (props.open ? '0' : '-200px')}; /* Slide in/out on small screens */
    z-index: 2; /* Ensure it floats above content */
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 300px;
  left: ${(props) => (props.open ? '180px' : '0')};
  background-color: #343a40;
  z-index: 3; /* Ensure button is above other content */
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  transition: left 0.3s ease-in-out;

  &:hover {
    background-color: #495057;
  }

  @media (min-width: 746px) {
    display: none; /* Hide toggle button on larger screens */
  }
`;

const StyledNav = styled(Nav)`
  flex-direction: column;
  height: 100%;
  padding-top: 60px;
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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

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
          <h3 className="text-white mb-5 mx-3">Admin Panel</h3>
          <StyledNavLink
            to="/"
            active={location.pathname === '/'}
          >
            Dashboard
          </StyledNavLink>
          <StyledNavLink
            to="/test-centers"
            active={location.pathname === '/test-centers'}
          >
            Test Centers
          </StyledNavLink>
          <StyledNavLink
            to="/students"
            active={location.pathname === '/students'}
          >
            Students
          </StyledNavLink>
          <StyledNavLink
            to="/teachers"
            active={location.pathname === '/teachers'}
          >
            Teachers
          </StyledNavLink>
          <StyledNavLink
            to="/scheduled-tests"
            active={location.pathname === '/scheduled-tests'}
          >
            Scheduled Tests
          </StyledNavLink>
          <StyledNavLink
            to="/papers"
            active={location.pathname === '/papers'}
          >
            Papers
          </StyledNavLink>
        </StyledNav>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
