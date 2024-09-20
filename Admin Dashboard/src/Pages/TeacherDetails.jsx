import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Keyframes for animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledContainer = styled(Container)`
  animation: ${fadeIn} 0.5s ease-in;
  margin-top: 2rem;
`;

const StyledCard = styled(Card)`
  background-color: #f8f9fa; // Light background
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledTable = styled(Table)`
  thead {
    background-color: #007bff; 
    color: white;
  }

  tbody tr {
    transition: background-color 0.3s;
  }

  @media (max-width: 768px) {
    thead {
      display: none; 
    }

    tbody {
      display: block;
      max-height: 80vh;
      overflow-y: auto;
    }

    tr {
      display: block;
      margin-bottom: 10px;
      border-bottom: 1px solid #dee2e6;
    }

    td {
      display: block;
      text-align: right;
      position: relative;
      padding-left: 50%;
      padding-right: 10px;

      &::before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 45%;
        padding-left: 10px;
        font-weight: bold;
        text-align: left;
      }
    }
  }
    @media (max-width: 768px) {
  thead {
    display: none; 
  }

  tbody {
    display: block;
    max-height: 80vh;
    overflow-y: auto;
  }

  tr {
    display: block;
    margin-bottom: 10px;
    border-bottom: 1px solid #dee2e6;
  }

  td {
    display: block;
    text-align: right;
    position: relative;
    padding-left: 50%;
    padding-right: 10px;

    &::before {
      content: attr(data-label);
      position: absolute;
      left: 0;
      width: 45%;
      padding-left: 10px;
      font-weight: bold;
      text-align: left;
    }
  }
}

`;

const EditButton = styled(Button)`
  background-color: #28a745; 
  border: none;

  &:hover {
    background-color: #218838; 
  }
`;


const PasswordInputGroup = styled.div`
  position: relative;

  input {
    padding-right: 40px; // Space for the icon
  }

  .icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

const TeacherDetails = () => {
  const { teacherId } = useParams();
  console.log('Teacher ID from URL:', teacherId);
  const navigate = useNavigate();
  function goBack(){
    navigate('/teachers')
  }
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [teacher, setTeacher] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    dateOfBirth: '1990-01-01',
    phone: '123-456-7890',
    hireDate: '2020-09-15',
    subjectSpecialization: 'Mathematics',
    address: '123 Main St, Anytown, USA',
    requiredQuestions: 0,
  });

  const questions = [
    { questionId: 1, questionText: 'What is 2 + 2?', option1: '3', option2: '4', option3: '5', option4: '6', difficultyLevel: 'easy' },
    { questionId: 2, questionText: 'What is the capital of France?', option1: 'London', option2: 'Berlin', option3: 'Paris', option4: 'Madrid', difficultyLevel: 'medium' },
    { questionId: 3, questionText: 'Solve the integral of x^2.', option1: 'x^3/3', option2: 'x^2', option3: '2x', option4: 'x/2', difficultyLevel: 'hard' },
    { questionId: 4, questionText: 'What is the square root of 16?', option1: '2', option2: '4', option3: '8', option4: '6', difficultyLevel: 'easy' },
    { questionId: 5, questionText: 'What is the chemical symbol for water?', option1: 'O2', option2: 'H2O', option3: 'CO2', option4: 'HO', difficultyLevel: 'easy' },
    { questionId: 6, questionText: 'What is the capital of Japan?', option1: 'Tokyo', option2: 'Kyoto', option3: 'Seoul', option4: 'Beijing', difficultyLevel: 'medium' },
    { questionId: 7, questionText: 'What is the Pythagorean theorem?', option1: 'a^2 + b^2 = c^2', option2: 'a + b = c', option3: 'a^2 - b^2 = c^2', option4: 'None of the above', difficultyLevel: 'medium' },
    { questionId: 8, questionText: 'What is the derivative of sin(x)?', option1: 'cos(x)', option2: 'sin(x)', option3: 'tan(x)', option4: '−sin(x)', difficultyLevel: 'hard' },
    { questionId: 9, questionText: 'What is the value of π (pi) to two decimal places?', option1: '3.12', option2: '3.14', option3: '3.16', option4: '3.10', difficultyLevel: 'easy' },
    { questionId: 10, questionText: 'Which planet is known as the Red Planet?', option1: 'Earth', option2: 'Mars', option3: 'Jupiter', option4: 'Venus', difficultyLevel: 'medium' },
    { questionId: 11, questionText: 'Who wrote "Hamlet"?', option1: 'Charles Dickens', option2: 'Mark Twain', option3: 'William Shakespeare', option4: 'J.K. Rowling', difficultyLevel: 'medium' },
    { questionId: 12, questionText: 'What is the integral of 1/x dx?', option1: 'ln(x) + C', option2: 'x + C', option3: 'e^x + C', option4: '1/x + C', difficultyLevel: 'hard' },
    { questionId: 13, questionText: 'What is 7 factorial (7!)?', option1: '5040', option2: '720', option3: '40320', option4: '10080', difficultyLevel: 'hard' },
    { questionId: 14, questionText: 'Which element has the atomic number 1?', option1: 'Helium', option2: 'Oxygen', option3: 'Hydrogen', option4: 'Carbon', difficultyLevel: 'easy' },
    { questionId: 15, questionText: 'What is the main ingredient in guacamole?', option1: 'Tomato', option2: 'Avocado', option3: 'Onion', option4: 'Pepper', difficultyLevel: 'easy' },
    { questionId: 16, questionText: 'What is the capital of Australia?', option1: 'Sydney', option2: 'Canberra', option3: 'Melbourne', option4: 'Brisbane', difficultyLevel: 'medium' },
    { questionId: 17, questionText: 'What is the speed of light?', option1: '300,000 km/s', option2: '150,000 km/s', option3: '1,000,000 km/s', option4: '200,000 km/s', difficultyLevel: 'hard' },
    { questionId: 18, questionText: 'In which year did the Titanic sink?', option1: '1905', option2: '1912', option3: '1918', option4: '1920', difficultyLevel: 'medium' },
    { questionId: 19, questionText: 'What is the primary language spoken in Brazil?', option1: 'Spanish', option2: 'Portuguese', option3: 'English', option4: 'French', difficultyLevel: 'easy' },
    { questionId: 20, questionText: 'What is the Fibonacci sequence starting with 0 and 1?', option1: '1, 1, 2, 3, 5, 8', option2: '0, 1, 1, 2, 3, 5', option3: '1, 2, 3, 5, 8, 13', option4: '0, 1, 2, 3, 5, 8', difficultyLevel: 'medium' },
  ];
  

  const extractDifficultyLevels = (questions) => {
    const difficultyLevels = questions.map(q => q.difficultyLevel);
    return [...new Set(difficultyLevels)];
  };

  const availableDifficulties = extractDifficultyLevels(questions);

  const [filteredQuestions, setFilteredQuestions] = useState(questions);

  useEffect(() => {
    setFilteredQuestions(
      questions.filter(q =>
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (difficultyFilter ? q.difficultyLevel === difficultyFilter : true)
      )
    );
  }, [searchQuery, difficultyFilter]);

  const handleEditShow = () => setShowModal(true);
  const handleEditClose = () => setShowModal(false);

  const handleSaveChanges = () => {
    console.log('Changes saved:', teacher);
    handleEditClose();
  };

  return (
    <StyledContainer>
          <Button className="btn-dark mb-4" onClick={goBack} >Back</Button>
      <Row>
        <Col md={12}>
          <StyledCard className="mb-4">
          <StyledCard.Body >
              <StyledCard.Title>{teacher.fullName}</StyledCard.Title>
              <Row className='mb-3'>
                <Col md={6}>
                  <StyledCard.Text>Email: {teacher.email}</StyledCard.Text>
                  <StyledCard.Text>Phone: {teacher.phone}</StyledCard.Text>
                  <StyledCard.Text>Hire Date: {teacher.hireDate}</StyledCard.Text>
                  <StyledCard.Text>Date of Birth: {teacher.dateOfBirth}</StyledCard.Text>
                </Col>
                <Col md={6}>
                  <StyledCard.Text>Subject Specialization: {teacher.subjectSpecialization}</StyledCard.Text>
                  <StyledCard.Text>Address: {teacher.address}</StyledCard.Text>
                  <StyledCard.Text>Password: {showPassword ? teacher.password : '●●●●●●●●'}</StyledCard.Text>
                </Col>
              </Row>
              <EditButton onClick={handleEditShow}>Edit Details</EditButton>
            </StyledCard.Body>
          </StyledCard>

          {/* Search Bar and Difficulty Filter */}
          <Row className="mb-4">
            <Col md={8}>
              <Form.Group controlId="searchQuestions">
                <Form.Label>Search Questions</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by question text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="difficultyFilter">
                <Form.Label>Filter by Difficulty</Form.Label>
                <Form.Control as="select" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                  <option value="">All</option>
                  {availableDifficulties.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Questions Table */}
          <StyledTable striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q, index) => (
                <tr key={q.questionId}>
                <td>{index + 1}</td>
                <td data-label="Question">{q.questionText}</td>
                <td data-label="Option 1">{q.option1}</td>
                <td data-label="Option 2">{q.option2}</td>
                <td data-label="Option 3">{q.option3}</td>
                <td data-label="Option 4">{q.option4}</td>
                <td data-label="Difficulty">{q.difficultyLevel.charAt(0).toUpperCase() + q.difficultyLevel.slice(1)}</td>
              </tr>
              ))}
            </tbody>
          </StyledTable>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Teacher Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={teacher.fullName}
                onChange={(e) => setTeacher({ ...teacher, fullName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={teacher.email}
                onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <PasswordInputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={teacher.password}
                  onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
                />
                <div className="icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </PasswordInputGroup>
            </Form.Group>
            <Form.Group controlId="formDateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={teacher.dateOfBirth}
                onChange={(e) => setTeacher({ ...teacher, dateOfBirth: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={teacher.phone}
                onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formHireDate">
              <Form.Label>Hire Date</Form.Label>
              <Form.Control
                type="date"
                value={teacher.hireDate}
                onChange={(e) => setTeacher({ ...teacher, hireDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formSubjectSpecialization">
              <Form.Label>Subject Specialization</Form.Label>
              <Form.Control
                type="text"
                value={teacher.subjectSpecialization}
                onChange={(e) => setTeacher({ ...teacher, subjectSpecialization: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={teacher.address}
                onChange={(e) => setTeacher({ ...teacher, address: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </StyledContainer>
  );
};

export default TeacherDetails;
