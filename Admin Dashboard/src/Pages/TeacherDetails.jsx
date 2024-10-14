import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Container,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useTeacher from "../Hooks/useTeacher";
import { useTeacherDetails } from "../Store/TeachersStore";

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
  console.log("Teacher ID from URL:", teacherId);
  const navigate = useNavigate();
  const { teacherDetails } = useTeacherDetails((state) => ({
    teacherDetails: state.teacherDetails,
  }));
  console.log("teachers", teacherDetails);
  const { getTeacher, updateTeacher } = useTeacher();
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teacher=await getTeacher(teacherId);
        console.log('teacher>>>>>>>>>', teacher)
        setTeacher({
          fullName: teacher.teacher.full_name,
          email: teacher.teacher.email,
          password: teacher.teacher.password,
          dateOfBirth: teacher.teacher.date_of_birth
            ? new Date(teacher.teacher.date_of_birth).toISOString().split("T")[0]
            : null,
          phone: teacher.teacher.phone,
          hireDate: teacher.teacher.hire_date
            ? new Date(teacher.teacher.hire_date).toISOString().split("T")[0]
            : null,
          subjectSpecialization: teacher.teacher.subject_specialization,
          address: teacher.teacher.address,
          requiredQuestions: teacher.teacher.required_questions,
        });
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacher();
  }, []);

  const handleSaveChanges = async () => {
    console.log("teacher------->", teacher);
    try {
      await updateTeacher(teacherId, teacher);
      console.log('teacher>>>>>>>>>>>>>>>', teacher)
      handleEditClose();
    } catch (error) {
      console.error("Error updating teacher data:", error);
    }
  };

  function goBack() {
    navigate("/teachers");
  }
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [teacher, setTeacher] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    phone: "",
    hireDate: "",
    subjectSpecialization: "",
    address: "",
    requiredQuestions: 0,
  });

  const extractDifficultyLevels = () => {
    const difficultyLevels = teacherDetails.questions?.map(
      (q) => q.difficultyLevel
    );
    return [...new Set(difficultyLevels)];
  };

  const availableDifficulties = extractDifficultyLevels(
    teacherDetails.questions
  );

  const [filteredQuestions, setFilteredQuestions] = useState(
    teacherDetails.questions
  );

  useEffect(() => {
    setFilteredQuestions(
      teacherDetails.questions?.filter(
        (q) =>
          q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (difficultyFilter ? q.difficultyLevel === difficultyFilter : true)
      )
    );
  }, [searchQuery, difficultyFilter]);

  const handleEditShow = () => setShowModal(true);
  const handleEditClose = () => setShowModal(false);

  return (
    <StyledContainer>
      <Button className="btn-dark mb-4" onClick={goBack}>
        Back
      </Button>
      <Row>
        <Col md={12}>
          <StyledCard className="mb-4 ">
            <StyledCard.Body>
              <StyledCard.Title>{teacherDetails.full_name}</StyledCard.Title>
              <Row className="my-3">
                <Col md={6}>
                  <StyledCard.Text>
                    Email: {teacherDetails.email}
                  </StyledCard.Text>
                  <StyledCard.Text>
                    Phone: {teacherDetails.phone}
                  </StyledCard.Text>
                  <StyledCard.Text>
                    Hire Date:{" "}
                    {teacherDetails.hire_date
                      ? new Date(teacherDetails.hire_date)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </StyledCard.Text>
                  <StyledCard.Text>
                    Date of Birth:{" "}
                    {teacherDetails.date_of_birth
                      ? new Date(teacherDetails.date_of_birth)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </StyledCard.Text>
                </Col>
                <Col md={6} className="">
                  <StyledCard.Text>
                    Subject Specialization:{" "}
                    {teacherDetails.subject_specialization}
                  </StyledCard.Text>
                  <StyledCard.Text>
                    Address: {teacherDetails.address}
                  </StyledCard.Text>
                  <StyledCard.Text>
                    Required Questions: {teacherDetails.required_questions}
                  </StyledCard.Text>
                  <StyledCard.Text>
                    Password:{" "}
                    {showPassword ? teacherDetails.password : "●●●●●●●●"}
                  </StyledCard.Text>
                </Col>
              </Row>
              <EditButton onClick={handleEditShow}>Edit Details</EditButton>
            </StyledCard.Body>
          </StyledCard>

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
                <Form.Control
                  as="select"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {availableDifficulties.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

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
              {filteredQuestions?.map((q, index) => (
                <tr key={q.questionId}>
                  <td>{index + 1}</td>
                  <td data-label="Question">{q.questionText}</td>
                  <td data-label="Option 1">{q.option1}</td>
                  <td data-label="Option 2">{q.option2}</td>
                  <td data-label="Option 3">{q.option3}</td>
                  <td data-label="Option 4">{q.option4}</td>
                  <td data-label="Difficulty">
                    {q.difficultyLevel.charAt(0).toUpperCase() +
                      q.difficultyLevel.slice(1)}
                  </td>
                </tr>
              ))}
              {!filteredQuestions ? (
                <td className="text-center" colSpan={7}>
                  No Questions Added Yet
                </td>
              ) : (
                <></>
              )}
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
                onChange={(e) =>
                  setTeacher({ ...teacher, fullName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={teacher.email}
                onChange={(e) =>
                  setTeacher({ ...teacher, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <PasswordInputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={teacher.password}
                  onChange={(e) =>
                    setTeacher({ ...teacher, password: e.target.value })
                  }
                />
                <div
                  className="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </PasswordInputGroup>
            </Form.Group>
            <Form.Group controlId="formDateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={teacher.dateOfBirth}
                onChange={(e) =>
                  setTeacher({ ...teacher, dateOfBirth: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={teacher.phone}
                onChange={(e) =>
                  setTeacher({ ...teacher, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formHireDate">
              <Form.Label>Hire Date</Form.Label>
              <Form.Control
                type="date"
                value={teacher.hireDate}
                onChange={(e) =>
                  setTeacher({ ...teacher, hireDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formSubjectSpecialization">
              <Form.Label>Subject Specialization</Form.Label>
              <Form.Control
                type="text"
                value={teacher.subjectSpecialization}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    subjectSpecialization: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formSubjectSpecialization">
              <Form.Label>Required Questions</Form.Label>
              <Form.Control
                type="text"
                value={teacher.requiredQuestions}
                onChange={(e) =>
                  setTeacher({
                    ...teacher,
                    requiredQuestions: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={teacher.address}
                onChange={(e) =>
                  setTeacher({ ...teacher, address: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledContainer>
  );
};

export default TeacherDetails;
