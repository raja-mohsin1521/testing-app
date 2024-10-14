import React from "react";
import { Card, CardFooter } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";

function ScoreCards(props) {
  return (
    <StyledCard>
      <CardHeader>
        <h4>{props.heading}</h4>
      </CardHeader>
      <CardBody>
        <h4>{props.number}</h4>
      </CardBody>
      <StyledCardFooter>
        <StyledLink to={props.link}>View Details</StyledLink>
      </StyledCardFooter>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  text-align: center;
  border: none;
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled(Card.Header)`
  background-color: #495057; 
  color: #ffc107; 
`;

const CardBody = styled(Card.Body)`
  padding: 20px; 
`;

const StyledCardFooter = styled(CardFooter)`
  background-color: #343a40;

  transition: all 0.3s;
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

export default ScoreCards;
