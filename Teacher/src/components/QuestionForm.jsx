import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { z } from "zod";
import { Button, Form } from "react-bootstrap";
import useQuestion from "../Hooks/useQustions";

const questionSchema = z.object({
  questionText: z
    .string()
    .min(5, "Question text must be at least 5 characters long"),
  correctAnswer: z.enum(
    ["A", "B", "C", "D"],
    "Correct answer must be A, B, C, or D"
  ),
  options: z.array(
    z
      .object({
        text: z.string().optional(),
        image: z.string().optional(),
      })
      .refine(
        (option) => option.text || option.image,
        "Each option must have either text or an image."
      )
  ),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  course: z.string().min(1, "Course is required"),
  image: z.string().optional(),
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

const NavigationButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
`;

const NavButton = styled(Button)`
  background-color: ${({ active }) => (active ? "#007bff" : "#6c757d")};
  color: white;
  padding: 5px 10px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: ${({ active }) => (active ? "#0056b3" : "#5a6268")};
  }
`;


const QuestionForm = () => {
  const { addQuestion, fetchCourses, fetchModules } = useQuestion();

  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const coursesData = await fetchCourses();
      setCourses(coursesData);
      
    };

    fetchData();
  }, []);

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      correctAnswer: "A",
      isImageBased: false,
      isImageBasedOptions: false,
      options: [
        { text: "", image: "" },
        { text: "", image: "" },
        { text: "", image: "" },
        { text: "", image: "" },
      ],
      difficultyLevel: "easy",
      course: "",
      module_id: "",
      image: "",
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errors, setErrors] = useState({});

 
  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    const updatedQuestions = [...questions];
  
    if (files && files.length > 0) {
      if (name === "image") {
        updatedQuestions[currentQuestionIndex][name] = files[0];
        updatedQuestions[currentQuestionIndex].isImageBased = true;
      } else if (name.startsWith("optionImage")) {
        const optionIndex = parseInt(name.split("optionImage")[1], 10);
        updatedQuestions[currentQuestionIndex].options[optionIndex].image = files[0];
        updatedQuestions[currentQuestionIndex].isImageBasedOptions = true;
      }
    } else {
      if (name.startsWith("option")) {
        const optionIndex = parseInt(name.split("option")[1], 10);
        updatedQuestions[currentQuestionIndex].options[optionIndex].text = value;
      } else if (name === "course" && value) {
        updatedQuestions[currentQuestionIndex][name] = value;
        const moduleData = await fetchModules(value);
        setModules(moduleData);
      } else if (name === "module") {
        updatedQuestions[currentQuestionIndex]["module_id"] = value; // Correctly update module_id
      } else {
        updatedQuestions[currentQuestionIndex][name] = value;
      }
    }
  
    setQuestions(updatedQuestions);
  };
  

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    const validationResult = questionSchema.safeParse(currentQuestion);
  
    
  
    try {
      const formData = new FormData();
  
      // Append question data
      formData.append("questionText", currentQuestion.questionText);
      formData.append("correctAnswer", currentQuestion.correctAnswer);
      formData.append("difficultyLevel", currentQuestion.difficultyLevel);
      formData.append("course_id", currentQuestion.course); 
      formData.append("module_id", currentQuestion.module_id); 
  
      if (currentQuestion.image) {
        formData.append("image", currentQuestion.image);
      }
  
      // Append options data
      currentQuestion.options.forEach((option, index) => {
        formData.append(`options[${index}][text]`, option.text);
        if (option.image) {
          formData.append(`options[${index}][image]`, option.image);
        }
      });
  
      formData.append("token", "14"); 
  
      
      await addQuestion(formData);
  
      // Reset form after submission
      setQuestions([{
        questionText: "",
        correctAnswer: "A",
        isImageBased: false,
        isImageBasedOptions: false,
        options: [
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
        ],
        difficultyLevel: "easy",
        course: "",
        module_id: "",
        image: "",
      }]);
      setErrors({});
      setCurrentQuestionIndex(0);
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.reduce((acc, { path, message }) => {
          acc[path[0]] = message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      }
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
          <StyledLabel>Question Image</StyledLabel>
          <StyledInput
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Options</StyledLabel>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div key={index}>
              <StyledInput
                type="text"
                name={`option${index}`}
                value={option.text}
                onChange={handleChange}
                placeholder={`Option ${index + 1}`}
                isInvalid={!!errors[`option${index}`]}
              />
              {errors[`option${index}`] && <ErrorText>{errors[`option${index}`]}</ErrorText>}

              <StyledInput
                type="file"
                name={`optionImage${index}`}
                onChange={handleChange}
                accept="image/*"
              />
            </div>
          ))}
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Correct Answer</StyledLabel>
          <StyledInput
            as="select"
            name="correctAnswer"
            value={questions[currentQuestionIndex].correctAnswer}
            onChange={handleChange}
          >
            <option value="A">Option 1</option>
            <option value="B">Option 2</option>
            <option value="C">Option 3</option>
            <option value="D">Option 4</option>
          </StyledInput>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Course</StyledLabel>
          <StyledInput
            as="select"
            name="course"
            value={questions[currentQuestionIndex]?.course}
            onChange={handleChange}
            isInvalid={!!errors.course}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </StyledInput>
          {errors.course && <ErrorText>{errors.course}</ErrorText>}
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Modules</StyledLabel>
          <StyledInput
            as="select"
            name="module"
            value={questions[currentQuestionIndex]?.module_id}
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

        <StyledButton type="submit">Submit Question</StyledButton>
      </StyledForm>
    </StyledFormContainer>
  );
};

export default QuestionForm;



