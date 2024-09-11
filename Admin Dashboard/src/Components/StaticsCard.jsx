import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const StyledCardHeader = styled(CardHeader)`
  background-color: #343a40; // Sidebar background color
 color: #ffc107; 
`;

const StyledCardFooter = styled(CardFooter)`
  background-color: #343a40; // Sidebar background color

transition:all 0.3s;
   &:hover {
    background-color: #495057; 
  }
`;

const StyledLink = styled(Link)`
  
  color: #fff;
  border: none;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;

margin: 10px 0px; 
  
`;

function StaticsCard(props) {
  return (
    <Card className="text-center">
      <StyledCardHeader>
        <h4 className="mt-2">{props.heading}</h4>
      </StyledCardHeader>
      <CardBody>
        {props.stats.map((stat, index) => (
          <Row className='mx-2 my-2' key={index}>
            <Col className='text-start' xs={8}>{stat.name}</Col>
            <Col className='text-end' xs={4}>{stat.value}</Col>
          </Row>
        ))}
      </CardBody>
      <StyledCardFooter>
        <StyledLink  to={props.link}>
         View More
        </StyledLink>
      </StyledCardFooter>
    </Card>
  );
}

export default StaticsCard;
