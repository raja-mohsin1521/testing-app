import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { z } from "zod";
import useTeacher from "../Hooks/useTeacher";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
  dateofbirth: z.string().min(1, { message: "Date of Birth is required" }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone number must be a valid number" }),
  address: z.string().min(1, { message: "Address is required" }),
  questions: z.string().min(1, { message: "Number of questions is required" }),
  hiredate: z.string().min(1, { message: "Hire date is required" }),
  specialization: z.string().min(1, { message: "Specialization is required" }),
});

const StyledFormContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormHeading = styled.h2`
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
`;

const StyledLabel = styled(Form.Label)`
  font-weight: bold;
  color: #343a40;
`;

const StyledFormControl = styled(Form.Control)`
  border-radius: 5px;
  border: 1px solid #ced4da;
  &:focus {
    border-color: #80bdff;
    box-shadow: none;
  }

  ${({ as }) =>
    as === "textarea" &&
    `
      width: 100%;
      resize: vertical;
  `}
`;

const StyledButton = styled(Button)`
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 10px;
`;

const TeacherForm = (props) => {
  const { createTeacher } = useTeacher();
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    dateofbirth: "",
    phone: "",
    address: "",
    questions: "",
    hiredate: "",
    specialization: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.parse(teacherData);

      await createTeacher({
        ...teacherData,
        id: Date.now().toString(),
      });

      setTeacherData({
        name: "",
        email: "",
        password: "",
        dateofbirth: "",
        phone: "",
        address: "",
        questions: "",
        hiredate: "",
        specialization: "",
      });
      setErrors({});
      props.setShowForm(false);
    } catch (err) {
      const formattedErrors = {};
      err.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setErrors(formattedErrors);
    }
  };

  const handleClear = () => {
    setTeacherData({
      name: "",
      email: "",
      password: "",
      dateofbirth: "",
      phone: "",
      address: "",
      questions: "",
      hiredate: "",
      specialization: "",
    });
    setErrors({});
  };

  return (
    <StyledFormContainer>
      <FormHeading>Add New Teacher</FormHeading>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Name</StyledLabel>
              <StyledFormControl
                type="text"
                name="name"
                value={teacherData.name}
                onChange={handleInputChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Email</StyledLabel>
              <StyledFormControl
                type="email"
                name="email"
                value={teacherData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Password</StyledLabel>
              <StyledFormControl
                type="password"
                name="password"
                value={teacherData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Date of Birth</StyledLabel>
              <StyledFormControl
                type="date"
                name="dateofbirth"
                value={teacherData.dateofbirth}
                onChange={handleInputChange}
                isInvalid={!!errors.dateofbirth}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateofbirth}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Phone</StyledLabel>
              <StyledFormControl
                type="text"
                name="phone"
                value={teacherData.phone}
                onChange={handleInputChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Questions</StyledLabel>
              <StyledFormControl
                type="number"
                name="questions"
                value={teacherData.questions}
                onChange={handleInputChange}
                isInvalid={!!errors.questions}
              />
              <Form.Control.Feedback type="invalid">
                {errors.questions}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Address</StyledLabel>
              <StyledFormControl
                as="textarea"
                name="address"
                value={teacherData.address}
                onChange={handleInputChange}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Hire Date</StyledLabel>
              <StyledFormControl
                type="date"
                name="hiredate"
                value={teacherData.hiredate}
                onChange={handleInputChange}
                isInvalid={!!errors.hiredate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.hiredate}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Specialization</StyledLabel>
              <StyledFormControl
                type="text"
                name="specialization"
                value={teacherData.specialization}
                onChange={handleInputChange}
                isInvalid={!!errors.specialization}
              />
              <Form.Control.Feedback type="invalid">
                {errors.specialization}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <div className="d-flex justify-content-center">
          <StyledButton type="submit">Save</StyledButton>
          <StyledButton type="button" variant="secondary" onClick={handleClear}>
            Clear
          </StyledButton>
        </div>
      </Form>
    </StyledFormContainer>
  );
};

export default TeacherForm;
