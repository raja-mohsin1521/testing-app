import React, { useState } from "react";
import styled from "styled-components";
import { z } from "zod";
import { Button, Form } from "react-bootstrap";
import useQuestion from "../Hooks/useQustions";

const questionSchema = z.object({
  questionText: z.string().min(5, "Question text must be at least 5 characters long"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  options: z.array(z.string().min(1, "Option cannot be empty")).length(4, "Must have exactly 4 options"),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
});

// Styled components for form styling
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

const ErrorText = styled.div`
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 5px;
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

const NavigationButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
`;

const NavButton = styled(Button)`
  background-color: ${({ active }) => (active ? '#007bff' : '#6c757d')};
  color: white;
  padding: 5px 10px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: ${({ active }) => (active ? '#0056b3' : '#5a6268')};
  }
`;

const QuestionForm = () => {
const {addQuestion} = useQuestion();

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      correctAnswer: '',
      options: ['', '', '', ''],
      difficultyLevel: 'Easy',
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];

    if (name.startsWith('option')) {
      const index = parseInt(name.split('option')[1], 10);
      updatedQuestions[currentQuestionIndex].options[index] = value;
    } else {
      updatedQuestions[currentQuestionIndex][name] = value;
    }

    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', correctAnswer: '', options: ['', '', '', ''], difficultyLevel: 'Easy' },
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      questionSchema.parse(questions[currentQuestionIndex]);
      
      const token = localStorage.getItem('token');
      const formattedData = {
        token,
        questions
      };
  
      await addQuestion(formattedData);
      console.log("Submitted Questions Data:", formattedData);
      
      setErrors({});
      
      // setQuestions([
      //   {
      //     questionText: '',
      //     correctAnswer: '',
      //     options: ['', '', '', ''],
      //     difficultyLevel: 'Easy',
      //   },
      // ]);
      setCurrentQuestionIndex(0);
    } catch (err) {
      if (err.errors) {
        const formattedErrors = {};
        err.errors.forEach(({ path, message }) => {
          formattedErrors[path[0]] = message;
        });
        setErrors(formattedErrors);
      }
    }
  };
  

  return (
    <StyledFormContainer>
      <NavigationButtons>
        {questions.map((_, index) => (
          <NavButton
            key={index}
            active={index === currentQuestionIndex}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </NavButton>
        ))}
        {questions.length < 10 && (
          <StyledButton onClick={handleAddQuestion}>Add Another</StyledButton>
        )}
      </NavigationButtons>

      <StyledForm onSubmit={handleSubmit}>
        <StyledFormGroup controlId="formQuestionText">
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

        <StyledFormGroup controlId="formCorrectAnswer">
          <StyledLabel>Correct Answer</StyledLabel>
          <StyledInput
            type="text"
            name="correctAnswer"
            value={questions[currentQuestionIndex].correctAnswer}
            onChange={handleChange}
            isInvalid={!!errors.correctAnswer}
          />
          {errors.correctAnswer && <ErrorText>{errors.correctAnswer}</ErrorText>}
        </StyledFormGroup>

        <StyledFormGroup controlId="formOptions">
          <StyledLabel>Options</StyledLabel>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <StyledInput
              key={index}
              type="text"
              name={`option${index}`}
              value={option}
              onChange={handleChange}
              placeholder={`Option ${index + 1}`}
              isInvalid={!!errors.options}
            />
          ))}
          {errors.options && <ErrorText>{errors.options}</ErrorText>}
        </StyledFormGroup>

        <StyledFormGroup controlId="formDifficulty">
          <StyledLabel>Difficulty Level</StyledLabel>
          <StyledInput
            type="text"
            name="difficultyLevel"
            value={questions[currentQuestionIndex].difficultyLevel}
            onChange={handleChange}
            isInvalid={!!errors.difficultyLevel}
          />
          {errors.difficultyLevel && <ErrorText>{errors.difficultyLevel}</ErrorText>}
        </StyledFormGroup>

        <StyledButton type="submit">Submit</StyledButton>
      </StyledForm>
    </StyledFormContainer>
  );
};

export default QuestionForm;
