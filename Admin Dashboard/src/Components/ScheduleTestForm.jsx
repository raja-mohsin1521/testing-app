import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import useScheduleTest from "../Hooks/useScheduleTest";

const StyledFormContainer = styled(Container)`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
`;

const FormHeading = styled.h2`
  text-align: center;
  color: #495057;
  margin-bottom: 25px;
  font-family: "Roboto", sans-serif;
`;

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 20px;
`;

const StyledLabel = styled(Form.Label)`
  font-weight: 500;
  color: #495057;
  margin-bottom: 10px;
`;

const StyledFormControl = styled(Form.Control)`
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 8px 12px;
  background-color: #f8f9fa;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
    background-color: #ffffff;
  }
  select {
    border-radius: 8px;
    border: 1px solid #ced4da;
    padding: 8px 12px;
    background-color: #f8f9fa;
    width: 100%;
  }
  option {
    background-color: #ffffff;
  }
`;

const StyledButton = styled(Button)`
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  margin: 5px;
  background-color: #007bff;
  color: #ffffff;
  &:hover {
    background-color: #0056b3;
    color: #ffffff;
  }
`;

const CenterContainer = styled(Row)`
  margin: 0 -15px;
`;

const CenterCheckbox = styled(Col)`
  margin-bottom: 15px;
`;

const NoCentersMessage = styled.p`
  text-align: center;
  color: #dc3545;
  font-weight: 500;
`;

const ScheduleTestForm = (props) => {
  const [validationError, setValidationError] = useState("");

  const {
    allCities,
    allTests,
    allCenters,
    specificCenters,
    fetchAllCities,
    fetchAllTests,
    fetchAllCenters,
    fetchSpecificCenters,
    addScheduledTest,
    loading,
    error,
  } = useScheduleTest();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedTest: "",
    location: "all",
    selectedCities: [],
    selectedCenters: [],
    regStartDate: "",
    regEndDate: "",
    testDate: "",
    testTime:""
  });

  const [noCentersMessage, setNoCentersMessage] = useState("");

  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  useEffect(() => {
    fetchAllCities();
  }, [fetchAllCities]);

  useEffect(() => {
    if (formData.location === "all" && formData.testDate && formData.testTime) {
      fetchAllCenters(formData.testDate,formData.testTime);
    }

    if (
      formData.location === "selected" &&
      formData.selectedCities.length > 0 &&
      formData.testDate && formData.testTime
    ) {
      fetchSpecificCenters({
        city: formData.selectedCities,
        date: formData.testDate,
        time: formData.testTime
      });
    }
  }, [
    formData.location,
    formData.selectedCities,
    formData.testDate,
    formData.testTime,
    fetchSpecificCenters,
    fetchAllCenters,
  ]);

  useEffect(() => {
    if (
      formData.location === "selected" &&
      formData.selectedCities.length === 0
    ) {
      setNoCentersMessage(
        "No cities selected. Please select at least one city to show centers."
      );
    } else {
      setNoCentersMessage("");
    }
  }, [formData.selectedCities, formData.location]);

  const handleNextStep = () => {
    const error = validateSelection();
    if (error) {
      setValidationError(error);
      return;
    }

    setStep(step + 1);
    setValidationError("");
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setValidationError("");
  };

  const handleInputChange = (e) => {
    setValidationError("");
    const { name, value, checked } = e.target;
    console.log("first", { formData });
    if (name === "selectedCities" || name === "selectedCenters") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateDates = () => {
    const today = new Date().toISOString().split("T")[0];
    const regStartDate = new Date(formData.regStartDate);
    const regEndDate = new Date(formData.regEndDate);
    const testDate = new Date(formData.testDate);
  
  
    let errors = [];
  
    if (!formData.regStartDate) {
      errors.push("Registration start date is required");
    }
    if (!formData.regEndDate) {
      errors.push("Registration end date is required");
    }
    if (!formData.testDate) {
      errors.push("Test date is required");
    }
  

    if (formData.regStartDate && regStartDate < new Date(today)) {
      errors.push("Registration start date must be today or later");
    }
    if (formData.regEndDate && regEndDate < regStartDate) {
      errors.push("Registration end date must be after the registration start date");
    }
    if (formData.regEndDate && formData.testDateTime && regEndDate >= testDate) {
      errors.push("Registration end date must be before the test date");
    }
  
    setValidationError(errors.length ? errors.join( '|  ') : null)
    return errors.length ? errors.join(" |  ") : null;
   
  };
  

  const validateSelection = () => {
    if (step === 1) {
      if (!formData.selectedTest) {
        return "Please select a test";
      }
      return null;
    }
  
   
    if (step === 2) {
      const dateValidationError = validateDates();
      if (dateValidationError) {
        return dateValidationError;
      }
    }
  
    if (step === 4 && formData.selectedCenters.length === 0) {
      return "Please select at least one center";
    }
  
    return null;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateSelection();
    if (error) {
        setValidationError(error);
      return;
    }
    console.log("FormData", formData);
    addScheduledTest(formData);
    props.setShowForm(false);
    setValidationError("");
    alert("Form submitted successfully!");
  };

  return (
    <StyledFormContainer>
      <FormHeading>Schedule a Test</FormHeading>
      <Form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <StyledFormGroup>
              <StyledLabel>Select Test</StyledLabel>
              <StyledFormControl
                as="select"
                name="selectedTest"
                value={formData.selectedTest}
                onChange={handleInputChange}
               
              >
                <option value="">Select a test</option>
                {allTests.map((test) => (
                  <option key={test.test_id} value={test.test_id}>
                    {test.test_name}
                  </option>
                ))}
              </StyledFormControl>
            </StyledFormGroup>
            <p className="text-danger">{validationError}</p>
            <StyledButton type="button" onClick={handleNextStep}>
              Next
            </StyledButton>
          </>
        )}

        {step === 2 && (
          <>
            <StyledFormGroup>
              <StyledLabel>Registration Start Date</StyledLabel>
              <StyledFormControl
                type="date"
                name="regStartDate"
                value={formData.regStartDate}
                onChange={handleInputChange}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <StyledLabel>Registration End Date</StyledLabel>
              <StyledFormControl
                type="date"
                name="regEndDate"
                value={formData.regEndDate}
                onChange={handleInputChange}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <StyledLabel>Test Date </StyledLabel>
              <StyledFormControl
                type="date"
                name="testDate"
                value={formData.testDate}
                onChange={handleInputChange}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <StyledLabel>Test Time</StyledLabel>
              <StyledFormControl
                type="time"
                name="testTime"
                value={formData.testTime}
                onChange={handleInputChange}
              />
            </StyledFormGroup>
            <p className="text-danger">{validationError}</p>
            <StyledButton type="button" onClick={handlePreviousStep}>
              Previous
            </StyledButton>
            <StyledButton type="button" onClick={handleNextStep}>
              Next
            </StyledButton>
          </>
        )}

        {step === 3 && (
          <>
            <StyledFormGroup>
              <StyledLabel>Where do you want to take the test?</StyledLabel>
              <Form.Check
                type="radio"
                label="All Pakistan"
                name="location"
                value="all"
                checked={formData.location === "all"}
                onChange={handleInputChange}
              />
              <Form.Check
                type="radio"
                label="Selected Cities"
                name="location"
                value="selected"
                checked={formData.location === "selected"}
                onChange={handleInputChange}
              />
            </StyledFormGroup>

            <StyledButton type="button" onClick={handlePreviousStep}>
              Previous
            </StyledButton>
            <StyledButton type="button" onClick={handleNextStep}>
              Next
            </StyledButton>
          </>
        )}

        {step === 4 && formData.location === "selected" && (
          <>
            <StyledFormGroup>
              <StyledLabel>Select Cities</StyledLabel>
              {allCities.map((city) => (
                <StyledFormGroup key={city.city}>
                  <Form.Check
                    type="checkbox"
                    label={city.city}
                    name="selectedCities"
                    value={city.city}
                    checked={formData.selectedCities.includes(city.city)}
                    onChange={handleInputChange}
                  />
                </StyledFormGroup>
              ))}
              
            </StyledFormGroup>

            {noCentersMessage ? 
                <NoCentersMessage>{noCentersMessage}</NoCentersMessage>
              : <StyledFormGroup>
              <StyledLabel>Select Centers</StyledLabel>
              {specificCenters.length > 0 ? (
                specificCenters.map((center) => (
                  <StyledFormGroup key={center.test_center_id}>
                    <Form.Check
                      type="checkbox"
                      label={`${center.institute_name}(${center.capacity})`}
                      name="selectedCenters"
                      value={center.test_center_id}
                      checked={formData.selectedCenters.includes(
                        String(center.test_center_id)
                      )}
                      onChange={handleInputChange}
                    />
                  </StyledFormGroup>
                ))
              ) : (
                <NoCentersMessage>
                  No centers available for the selected date
                </NoCentersMessage>
              )}
            </StyledFormGroup>}
            <p className="text-danger">{validationError}</p>
            <StyledButton type="button" onClick={handlePreviousStep}>
              Previous
            </StyledButton>
            <StyledButton type="submit">Submit</StyledButton>
          </>
        )}

        {step === 4 && formData.location === "all" && (
          <>
            <StyledFormGroup>
              <StyledLabel>Select Centers</StyledLabel>
              {allCenters.length > 0 ? (
                allCenters.map((center) => (
                  <StyledFormGroup key={center.test_center_id}>
                    <Form.Check
                      type="checkbox"
                      label={`${center.institute_name},${center.city}(${center.capacity})`}
                      name="selectedCenters"
                      value={center.test_center_id}
                      checked={formData.selectedCenters.includes(String(center.test_center_id))}

                      onChange={handleInputChange}
                    />
                  </StyledFormGroup>
                ))
              ) : (
                <NoCentersMessage>
                  No centers available for the selected date
                </NoCentersMessage>
              )}
            </StyledFormGroup>
            <p className="text-danger">{validationError}</p>
            <StyledButton type="button" onClick={handlePreviousStep}>
              Previous
            </StyledButton>
            <StyledButton type="submit">Submit</StyledButton>
          </>
        )}
      </Form>
    </StyledFormContainer>
  );
};

export default ScheduleTestForm;
