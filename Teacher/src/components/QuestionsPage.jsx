import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import QuestionForm from "./QuestionForm";
import QuestionsTable from "./QuestionsTable";


const StyledContainer = styled(Container)`
  background: linear-gradient(135deg, #f6f9fc, #e9ecef);
  min-height: 100vh;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeaderRow = styled(Row)`
  margin-bottom: 20px;
  text-align: end;

  @media (max-width: 576px) {
    text-align: center;
  }
`;

// Styled Button
const StyledButton = styled(Button)`
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 50px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.5);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.6);
  }

  @media (max-width: 576px) {
    font-size: 14px;
    padding: 8px 15px;
    width: 100%;
    margin-bottom: 10px;
  }
`;

// Animation for form visibility
const AnimatedForm = styled.div`
  animation: ${({ isVisible }) =>
    isVisible
      ? "fadeIn 0.5s ease-in-out forwards"
      : "fadeOut 0.5s ease-in-out forwards"};
  overflow: hidden;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      height: 0;
    }
    100% {
      opacity: 1;
      height: auto;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
      height: auto;
    }
    100% {
      opacity: 0;
      height: 0;
    }
  }
`;

// Decorative line for separation
const DecorativeLine = styled.div`
  width: 80%;
  height: 4px;
  background: linear-gradient(to right, #007bff, #17a2b8);
  margin: 20px auto;
  border-radius: 10px;
`;

const QuestionsPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <StyledContainer fluid>
      <AnimatedForm isVisible={showForm}>{showForm && <QuestionForm />}</AnimatedForm>
     {!showForm?<></>:<DecorativeLine />} 

    
      <HeaderRow>
        <Col>
          <StyledButton onClick={() => setShowForm(!showForm)}>
            {showForm ? "Hide Form" : "Add Question"}
          </StyledButton>
        </Col>
      </HeaderRow>

     
     

   
      <QuestionsTable />
    </StyledContainer>
  );
};

export default QuestionsPage;
