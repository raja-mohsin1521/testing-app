import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { z } from "zod";
import { Button, Form } from "react-bootstrap";
import useQuestion from "../Hooks/useQustions";
import Alert from "./Alert";


const questionSchema = z.object({
  questionText: z.string().min(5, "Question text must be at least 5 characters long"),
  notes: z.string().optional(),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  course_id: z.string().min(1, "Course ID is required"),
  module_id: z.string().min(1, "Module ID is required"),
  marks: z.string().min(1, "Marks must be greater than 0"), 
});

const StyledFormContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled(Form.Label)`
  font-weight: 600;
  margin-bottom: 5px;
`;

const StyledInput = styled(Form.Control)`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
  }
`;

const StyledButton = styled(Button)`
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.div`
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 5px;
`;

const SubQuestionForm = () => {
  const { addSubjectiveQuestion, fetchCourses, fetchModules } = useQuestion();

  const [showAlert, setShowAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [statusCode, setStatusCode] = useState(0);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [questions, setQuestions] = useState([{
    questionText: "",
    notes: "",
    difficultyLevel: "easy",
    course_id: "", 
    module_id: "", 
    image: "",
    marks: "", // New field for marks
  }]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errors, setErrors] = useState({});
  

  useEffect(() => {
    const fetchData = async () => {
      const coursesData = await fetchCourses();
      setCourses(coursesData);
      
    };

    fetchData();
  }, []);
  const getToken = () => localStorage.getItem('token');
  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    const updatedQuestions = [...questions];

    if (files && files.length > 0) {
      if (name === "image") {
        updatedQuestions[currentQuestionIndex][name] = files[0];
      }
    } else {
      updatedQuestions[currentQuestionIndex][name] = value;

      if (name === "course_id" && value) {
        const moduleData = await fetchModules(value); // Fetch modules based on course_id
        setModules(moduleData); // Set the fetched modules to the state
      }
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    const validationResult = questionSchema.safeParse(currentQuestion);

    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.errors.forEach(({ path, message }) => {
        formattedErrors[path[0]] = message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("questionText", currentQuestion.questionText);
      formData.append("notes", currentQuestion.notes || "");
      formData.append("difficultyLevel", currentQuestion.difficultyLevel);
      formData.append("course_id", currentQuestion.course_id); // Updated to course_id
      formData.append("module_id", currentQuestion.module_id); // Updated to module_id
      formData.append("marks", currentQuestion.marks); // Add marks field

      if (currentQuestion.image) {
        formData.append("image", currentQuestion.image);
      }

      formData.append("token", getToken());

      
      const data = await addSubjectiveQuestion(formData);
console.log('data', data)
      setAlertMessage(data.error)
      setStatusCode(data.status)
      setShowAlert(false);

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(true);
      }, 3000);
    
      setQuestions([{
        questionText: "",
        notes: "",
        difficultyLevel: "easy",
        course_id: "", 
        module_id: "", 
        image: "",
        marks: "", // Reset marks field
      }]);
      setErrors({});
      setCurrentQuestionIndex(0);

      
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <StyledFormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFormGroup>
          <StyledLabel>Question Text</StyledLabel>
          <StyledInput
            type="text"
            name="questionText"
            value={questions[currentQuestionIndex].questionText}
            onChange={handleChange}
            isInvalid={!!errors.questionText}
          />
          {errors.questionText && <ErrorText>{errors.questionText}</ErrorText>}
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Notes (Optional)</StyledLabel>
          <StyledInput
            type="text"
            name="notes"
            value={questions[currentQuestionIndex].notes}
            onChange={handleChange}
            isInvalid={!!errors.notes}
          />
          {errors.notes && <ErrorText>{errors.notes}</ErrorText>}
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Question Image</StyledLabel>
          <StyledInput
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Course</StyledLabel>
          <StyledInput
            as="select"
            name="course_id" 
            value={questions[currentQuestionIndex].course_id} 
            onChange={handleChange}
            isInvalid={!!errors.course_id}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </StyledInput>
          {errors.course_id && <ErrorText>{errors.course_id}</ErrorText>}
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Modules</StyledLabel>
          <StyledInput
            as="select"
            name="module_id" // Updated to module_id
            value={questions[currentQuestionIndex].module_id}
            onChange={handleChange}
            isInvalid={!!errors.module_id}
          >
            <option value="">Select Module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.module_name}
              </option>
            ))}
          </StyledInput>
          {errors.module_id && <ErrorText>{errors.module_id}</ErrorText>}
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Difficulty Level</StyledLabel>
          <StyledInput
            as="select"
            name="difficultyLevel"
            value={questions[currentQuestionIndex].difficultyLevel}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </StyledInput>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Marks</StyledLabel>
          <StyledInput
            type="number"
            name="marks"
            value={questions[currentQuestionIndex].marks}
            onChange={handleChange}
            isInvalid={!!errors.marks}
          />
          {errors.marks && <ErrorText>{errors.marks}</ErrorText>}
        </StyledFormGroup>

        {!showAlert? <Alert alertMessage={alertMessage} statusCode={statusCode} />:<></>}

        <StyledButton type="submit">Submit</StyledButton>
      </StyledForm>
    </StyledFormContainer>
  );
};



export default SubQuestionForm;
