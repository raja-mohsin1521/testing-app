import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { z } from "zod";
import useTest from "../Hooks/useTest";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  eligibility_criteria: z
    .string()
    .min(1, { message: "Eligibility criteria is required" }),
  difficulty_level: z.enum(["easy", "medium", "hard"], {
    message: "Difficulty level must be one of 'easy', 'medium', or 'hard'",
  }),
  number_of_questions: z
    .number()
    .min(1, { message: "Number of questions must be at least 1" }),
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
  `}
`;

const StyledButton = styled(Button)`
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 10px;
`;

const TestForm = (props) => {
  const { addTest, fetchTests } = useTest();
  const [testData, setTestData] = useState({
    name: "",
    subject: "",
    eligibility_criteria: "",
    difficulty_level: "",
    number_of_questions: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestData({
      ...testData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.parse({
        ...testData,
        number_of_questions: Number(testData.number_of_questions),
      });

      await addTest({
        ...testData,
        number_of_questions: Number(testData.number_of_questions),
      });

      setTestData({
        name: "",
        subject: "",
        eligibility_criteria: "",
        difficulty_level: "",
        number_of_questions: "",
      });
      setErrors({});
      props.setShowForm(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = {};
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  const handleClear = () => {
    setTestData({
      name: "",
      subject: "",
      eligibility_criteria: "",
      difficulty_level: "",
      number_of_questions: "",
    });
    setErrors({});
  };

  return (
    <StyledFormContainer>
      <FormHeading>Add New Test</FormHeading>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Name</StyledLabel>
              <StyledFormControl
                type="text"
                name="name"
                value={testData.name}
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
              <StyledLabel>Subject</StyledLabel>
              <StyledFormControl
                type="text"
                name="subject"
                value={testData.subject}
                onChange={handleInputChange}
                isInvalid={!!errors.subject}
              />
              <Form.Control.Feedback type="invalid">
                {errors.subject}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Difficulty Level</StyledLabel>
              <StyledFormControl
                type="text"
                name="difficulty_level"
                value={testData.difficulty_level}
                onChange={handleInputChange}
                isInvalid={!!errors.difficulty_level}
              />
              <Form.Control.Feedback type="invalid">
                {errors.difficulty_level}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Number of Questions</StyledLabel>
              <StyledFormControl
                type="number"
                name="number_of_questions"
                value={testData.number_of_questions}
                onChange={handleInputChange}
                isInvalid={!!errors.number_of_questions}
              />
              <Form.Control.Feedback type="invalid">
                {errors.number_of_questions}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={12}>
            <StyledLabel>Eligibility Criteria</StyledLabel>
            <StyledFormGroup>
              <StyledFormControl
                as="textarea"
                rows={4}
                name="eligibility_criteria"
                value={testData.eligibility_criteria}
                onChange={handleInputChange}
                isInvalid={!!errors.eligibility_criteria}
              />
              <Form.Control.Feedback type="invalid">
                {errors.eligibility_criteria}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <div className="text-center">
          <StyledButton type="submit" variant="primary">
            Save
          </StyledButton>
          <StyledButton type="button" variant="secondary" onClick={handleClear}>
            Clear
          </StyledButton>
        </div>
      </Form>
    </StyledFormContainer>
  );
};

export default TestForm;
