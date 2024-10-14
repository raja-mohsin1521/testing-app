import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import styled from "styled-components";
import useAuth from "../Hooks/useAuth";

const StyledCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#34495e' : '#ffffff')};
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 30px;
  padding: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    font-size: 2rem;
    font-weight: 600;
    color: ${({ isDarkMode }) => (isDarkMode ? '#ecf0f1' : '#2c3e50')};
    margin-bottom: 20px;
  }

  .card-text {
    color: ${({ isDarkMode }) => (isDarkMode ? '#bdc3c7' : '#34495e')};
    margin-bottom: 15px;
    line-height: 1.8;
    font-size: 1.1rem;
    padding: 10px;
    border: 1px solid ${({ isDarkMode }) => (isDarkMode ? '#555' : '#ddd')};
    border-radius: 8px;
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#2c3e50' : '#f9f9f9')};
  }

  button {
    margin-top: 20px;
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
      background-color: #0056b3;
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    .card-title {
      font-size: 1.5rem;
    }

    .card-text {
      font-size: 1rem;
    }

    .mb-3 {
      padding: 5px 0;
    }
  }
`;

const StyledFormControl = styled(Form.Control)`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ isDarkMode }) => (isDarkMode ? '#555' : '#ced4da')};
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#2c3e50' : '#ffffff')};
  color: ${({ isDarkMode }) => (isDarkMode ? '#ecf0f1' : '#212529')};
  padding: 10px 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5), 0 0 15px rgba(0, 123, 255, 0.3);
    outline: none;
  }

  &::placeholder {
    color: ${({ isDarkMode }) => (isDarkMode ? '#bdc3c7' : '#6c757d')};
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }

  &:hover {
    border-color: ${({ isDarkMode }) => (isDarkMode ? '#007bff' : '#0056b3')};
  }

  resize: vertical;
`;

const TeacherDetailsCard = ({ isDarkMode, DetailedTeacher }) => {
  const { updateTeacher } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTeacherDetails(DetailedTeacher?.teacher || {});
    setLoading(false);
  }, [DetailedTeacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEdit = () => {
    if (isEditing) {
      updateTeacher(teacherDetails);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setTeacherDetails(DetailedTeacher.teacher);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading teacher details...</p>
      </div>
    );
  }

  return (
    <StyledCard isDarkMode={isDarkMode}>
      <Card.Body>
        <Card.Title>Teacher Details</Card.Title>
        {isEditing ? (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <StyledFormControl
                    type="text"
                    name="fullName"
                    value={teacherDetails.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <StyledFormControl
                    type="email"
                    name="email"
                    value={teacherDetails.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <StyledFormControl
                    type="password"
                    name="password"
                    value={teacherDetails.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDateOfBirth">
                  <Form.Label>Date of Birth</Form.Label>
                  <StyledFormControl
                    type="date"
                    name="dateOfBirth"
                    value={formatDate(teacherDetails.date_of_birth)}
                    onChange={handleChange}
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <StyledFormControl
                    type="text"
                    name="phone"
                    value={teacherDetails.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formHireDate">
                  <Form.Label>Hire Date</Form.Label>
                  <StyledFormControl
                    type="date"
                    name="hireDate"
                    value={formatDate(teacherDetails.hire_date)}
                    onChange={handleChange}
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formSpecialization">
                  <Form.Label>Specialization</Form.Label>
                  <StyledFormControl
                    type="text"
                    name="subjectSpecialization"
                    value={teacherDetails.subject_specialization}
                    onChange={handleChange}
                    placeholder="Enter specialization"
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Label>Address</Form.Label>
                <Form.Group controlId="formAddress">
                  <StyledFormControl
                    as="textarea"
                    rows={3}
                    name="address"
                    value={teacherDetails.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    isDarkMode={isDarkMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={handleEdit}>
              {isEditing ? "Save" : "Edit"}
            </Button>
            <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </Form>
        ) : (
          <>
            <Card.Text>
              <Row>
                <Col md={6}>
                  <strong>Full Name:</strong> {teacherDetails.full_name}
                </Col>
                <Col md={6}>
                  <strong>Email:</strong> {teacherDetails.email}
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <strong>Phone:</strong> {teacherDetails.phone}
                </Col>
                <Col md={6}>
                  <strong>Date of Birth:</strong> {formatDate(teacherDetails.date_of_birth)}
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <strong>Hire Date:</strong> {formatDate(teacherDetails.hire_date)}
                </Col>
                <Col md={6}>
                  <strong>Specialization:</strong> {teacherDetails.subject_specialization}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <strong>Address:</strong> {teacherDetails.address}
                </Col>
              </Row>
            </Card.Text>
            <Button variant="primary" onClick={handleEdit}>
              Edit
            </Button>
          </>
        )}
      </Card.Body>
    </StyledCard>
  );
};

export default TeacherDetailsCard;
