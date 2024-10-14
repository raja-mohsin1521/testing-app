import React, { useState } from "react";
import {
  Table,
  Form,
  Pagination,
  Button,
  Modal,
} from "react-bootstrap";
import styled from "styled-components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema using Zod
const validationSchema = z.object({
  text: z.string().min(5, "Question must be at least 5 characters long"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "There must be exactly 4 options"),
  answer: z.string().min(1, "Correct answer is required"),
  difficulty: z
    .string()
    .min(1, "Difficulty level is required")
    .regex(/^[a-zA-Z ]*$/, "Difficulty must be a valid text"),
});

// Main container styling
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

// Styled Table
const StyledTable = styled(Table)`
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  thead {
    background-color: #343a40;
    color: #ffffff;

    th {
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      padding: 12px;
    }
  }

  tbody {
    tr {
      &:hover {
        background-color: #f1f1f1;
      }

      td {
        padding: 10px;
        text-align: center;
        border: 1px solid #dee2e6;
      }
    }
  }
`;


const StyledPagination = styled(Pagination)`
  margin-top: 20px;
  justify-content: center;
`;

const StyledFormControl = styled(Form.Control)`
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const QuestionsTable = () => {
  const initialQuestions = [
    {
      id: 1,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
      difficulty: "Easy",
    },
    {
      id: 2,
      text: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: "Paris",
      difficulty: "Medium",
    },
    // Add more initial questions as needed
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 2; // Adjust the number of questions per page
  const totalPages = 1; // Total number of pages

  // React Hook Form setup with Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const handleEdit = (question) => {
    setSelectedQuestion({ ...question });
    reset(question);
    setShowModal(true);
  };

  const handleSave = (data) => {
    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id ? { ...selectedQuestion, ...data } : q
    );
    setQuestions(updatedQuestions);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Maximum visible page numbers

    if (totalPages <= maxVisiblePages) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
    } else {
      const leftLimit = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rightLimit = Math.min(totalPages, leftLimit + maxVisiblePages - 1);

      // Previous button
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        />
      );

      // First page
      if (leftLimit > 1) {
        items.push(
          <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
            {1}
          </Pagination.Item>
        );
        if (leftLimit > 2) {
          items.push(<Pagination.Ellipsis key="first-ellipsis" />);
        }
      }

      // Middle pages
      for (let number = leftLimit; number <= rightLimit; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      }

      // Last page
      if (rightLimit < totalPages) {
        if (rightLimit < totalPages - 1) {
          items.push(<Pagination.Ellipsis key="last-ellipsis" />);
        }
        items.push(
          <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </Pagination.Item>
        );
      }

      // Next button
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        />
      );
    }

    return items;
  };

  return (
    <Container className="mb-5">
      <StyledTable striped bordered hover responsive>
        <thead>
          <tr>
            <th>Question</th>
            <th>Option 1</th>
            <th>Option 2</th>
            <th>Option 3</th>
            <th>Option 4</th>
            <th>Correct Answer</th>
            <th>Difficulty Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.map((q) => (
            <tr key={q.id}>
              <td>{q.text}</td>
              {q.options.map((option, index) => (
                <td key={index}>{option}</td>
              ))}
              <td>{q.answer}</td>
              <td>{q.difficulty}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(q)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(q.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>

      {/* Modal for Editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleSave)}>
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <StyledFormControl
                type="text"
                {...register("text")}
                isInvalid={!!errors.text}
              />
              <Form.Control.Feedback type="invalid">
                {errors.text?.message}
              </Form.Control.Feedback>
            </Form.Group>
            {["Option 1", "Option 2", "Option 3", "Option 4"].map((label, index) => (
              <Form.Group key={index}>
                <Form.Label>{label}</Form.Label>
                <StyledFormControl
                  type="text"
                  {...register(`options.${index}`)}
                  isInvalid={!!errors.options?.[index]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.options?.[index]?.message}
                </Form.Control.Feedback>
              </Form.Group>
            ))}
            <Form.Group>
              <Form.Label>Correct Answer</Form.Label>
              <StyledFormControl
                type="text"
                {...register("answer")}
                isInvalid={!!errors.answer}
              />
              <Form.Control.Feedback type="invalid">
                {errors.answer?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Difficulty Level</Form.Label>
              <StyledFormControl
                type="text"
                {...register("difficulty")}
                isInvalid={!!errors.difficulty}
              />
              <Form.Control.Feedback type="invalid">
                {errors.difficulty?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Pagination */}
      <StyledPagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
        {generatePaginationItems()}
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </StyledPagination>
    </Container>
  );
};

export default QuestionsTable;
