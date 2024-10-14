import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { z } from "zod";
import useTestCenter from "../Hooks/useTestCenter";

const schema = z.object({
  adminEmail: z
    .string()
    .min(1, { message: "Admin Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
  instituteName: z
    .string()
    .min(1, { message: "Institute or Place Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
  city: z.string().min(1, { message: "City is required" }),
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
`;

const StyledButton = styled(Button)`
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 10px;
`;

const TestCenterForm = (props) => {
  const { addTestCenter, fetchTestCenters } = useTestCenter();
  const [testCenterData, setTestCenterData] = useState({
    adminEmail: "",
    password: "",
    instituteName: "",
    address: "",
    capacity: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestCenterData({
      ...testCenterData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.parse({
        ...testCenterData,
        capacity: Number(testCenterData.capacity),
      });

      await addTestCenter({
        ...testCenterData,
        capacity: Number(testCenterData.capacity),
      });

      setTestCenterData({
        adminEmail: "",
        password: "",
        instituteName: "",
        address: "",
        capacity: "",
        city: "",
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
    setTestCenterData({
      adminEmail: "",
      password: "",
      instituteName: "",
      address: "",
      capacity: "",
      city: "",
    });
    setErrors({});
  };

  return (
    <StyledFormContainer>
      <FormHeading>Add New Test Center</FormHeading>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Admin Email</StyledLabel>
              <StyledFormControl
                type="email"
                name="adminEmail"
                value={testCenterData.adminEmail}
                onChange={handleInputChange}
                isInvalid={!!errors.adminEmail}
              />
              <Form.Control.Feedback type="invalid">
                {errors.adminEmail}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Password</StyledLabel>
              <StyledFormControl
                type="password"
                name="password"
                value={testCenterData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Institute or Place Name</StyledLabel>
              <StyledFormControl
                type="text"
                name="instituteName"
                value={testCenterData.instituteName}
                onChange={handleInputChange}
                isInvalid={!!errors.instituteName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.instituteName}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>Address</StyledLabel>
              <StyledFormControl
                type="text"
                name="address"
                value={testCenterData.address}
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
              <StyledLabel>Capacity</StyledLabel>
              <StyledFormControl
                type="number"
                name="capacity"
                value={testCenterData.capacity}
                onChange={handleInputChange}
                isInvalid={!!errors.capacity}
              />
              <Form.Control.Feedback type="invalid">
                {errors.capacity}
              </Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col md={6} xs={12}>
            <StyledFormGroup>
              <StyledLabel>City</StyledLabel>
              <StyledFormControl
                type="text"
                name="city"
                value={testCenterData.city}
                onChange={handleInputChange}
                isInvalid={!!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
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

export default TestCenterForm;
