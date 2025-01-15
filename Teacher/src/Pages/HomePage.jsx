import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TeacherDetailsCard from "../components/TeacherDetailsCard";
import styled, { keyframes } from "styled-components";
import useDashboard from "../Hooks/useDasboard";

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

const StyledContainer = styled(Container)`
  min-height: 100vh;
  background: ${({ isDarkMode }) => (isDarkMode ? '#1e1e2f' : 'linear-gradient(to right, #ece9e6, #ffffff)')};
  color: ${({ isDarkMode }) => (isDarkMode ? '#e0e0e0' : '#2c3e50')};
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StyledCard = styled.div`
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#34495e' : '#ffffff')};
  border-radius: 15px;
  padding: 40px;
  margin: 15px 0;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  }

  h4 {
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 1.3rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: bold;
  }
`;

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { getAddedQuestionsCount, getRequiredQuestionsCount,getTeacherDetails } = useDashboard();
  const [addedQuestionsCount, setAddedQuestionsCount] = useState({
    objective_questions_count: 0,
    subjective_questions_count: 0,
  });
  
  const [requiredQuestionsCount, setRequiredQuestionsCount] = useState({  objective_questions_count: 0,
    subjective_questions_count: 0,}||null);
  const [teacherDetails, setTeacherDetails] = useState({


  });
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const addedCount = await getAddedQuestionsCount();
        const requiredCount = await getRequiredQuestionsCount();
        const teacherDetailsData = await getTeacherDetails(); 
        console.log('first', addedCount)
        setAddedQuestionsCount(addedCount);
        setRequiredQuestionsCount(requiredCount);
        setTeacherDetails(teacherDetailsData); 
        
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, []);
  return (
    <StyledContainer fluid isDarkMode={isDarkMode}>
     
      <Row className="justify-content-center">
        {[
          { title: "Added Questions", countObj: addedQuestionsCount.objective_questions_count , countSub:  addedQuestionsCount.subjective_questions_count},
          { title: "Required Questions", countObj: requiredQuestionsCount.required_objective_questions , countSub:  requiredQuestionsCount.required_subjective_questions },
          { title: "Remaining Questions", countObj: requiredQuestionsCount.required_objective_questions-addedQuestionsCount.objective_questions_count||0 , countSub:  requiredQuestionsCount.required_subjective_questions-addedQuestionsCount.subjective_questions_count||0  }, 
        ].map(({ title, countObj, countSub}, index) => (
          <Col md={4} key={index}>
            <StyledCard isDarkMode={isDarkMode}>
              <h3>{title}</h3>
              <Row className="mt-4">
                <Col xs={6}>
                <h5>Objective</h5>
                <h1 className="display-4">{countObj}</h1>
                </Col>
                <Col xs={6}>
                <h5>Subjective</h5>
                <h1 className="display-4">{countSub}</h1>
                </Col>
              </Row>
              
            </StyledCard>
          </Col>
        ))}
      </Row>
      <Row>
        <Col md={12} className="mt-4">
          <TeacherDetailsCard  DetailedTeacher={teacherDetails} isDarkMode={isDarkMode} />
        </Col>
      </Row>
    </StyledContainer>
  );
};

export default HomePage;
