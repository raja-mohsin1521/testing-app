import React, { useEffect, useState } from "react";
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
import useStore from '../store';
import useQuestion from "../Hooks/useQustions";



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
overflow-x:scroll;
  margin: auto;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;


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

const SubjectiveQuestionsTable = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { getSubjectiveQuestionsWithoutImages ,deleteQuestion} = useQuestion();

  const [isExpanded, setIsExpanded] = useState({
    question_text: false,
    notes: false,
  });

  const toggleExpand = (field) => {
    setIsExpanded((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getLimitedText = (text, limit, field) => {
    if (text.length <= limit || isExpanded[field]) {
      return text;
    }
    return text.slice(0, limit) + "...";
  };
  useEffect(() => {
    const fetchData = async () => {
      const { subjective, total } = await getSubjectiveQuestionsWithoutImages(currentPage);
   
      
      
      setQuestions(subjective);
      setTotalPages(Math.ceil(total / 25));
    };

    fetchData();
  }, [currentPage]); 

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

  const handleDelete = (id,type) => {
    deleteQuestion(id,type)
    setQuestions(questions.filter((q) => q.id !== id));

  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

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

      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        />
      );

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
    <Container fluid className="mb-5">
      <StyledTable striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Question</th>
           
           <th>Notes</th>
            <th>Difficulty Level</th>
            <th>Course</th>
            <th>Module</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.length==0?<tr ><td colspan="9">No Questions Found</td></tr>:questions.map((q,index) => (
            <tr key={q.obj_question_id}>
              <th>{((currentPage-1)*25)+(index+1)}</th>
              <td>
        {getLimitedText(q.question_text, 25, "question_text")}
        {q.question_text.length > 25 && (
          <button onClick={() => toggleExpand("question_text")}>
            {isExpanded.question_text ? "Show Less" : "Show More"}
          </button>
        )}
      </td>
      <td>
        {getLimitedText(q.notes, 25, "notes")}
        {q.notes.length > 25 && (
          <button onClick={() => toggleExpand("notes")}>
            {isExpanded.notes ? "Show Less" : "Show More"}
          </button>
        )}
      </td>
              <td>{q.difficulty_level}</td>
              <td>{q.course_name}</td>
              <td>{q.module_name}</td>
              <td>{q.marks}</td>
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
                  onClick={() => handleDelete(q.subj_question_id , 'sub')}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>


      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleSave)}>
            <Form.Group>
              <Form.Label>Subjective Question</Form.Label>
              <StyledFormControl
                type="text"
                {...register("question_text")}
                isInvalid={!!errors.question_text}
              />
              <Form.Control.Feedback type="invalid">
                {errors.question_text?.message}
              </Form.Control.Feedback>
            </Form.Group>
            {["Option 1", "Option 2", "Option 3", "Option 4"].map((label, index) => (
              <Form.Group key={index}>
                <Form.Label>{label}</Form.Label>
                <StyledFormControl
                  type="text"
                  {...register(`option_${index + 1}`)}
                  isInvalid={!!errors[`option_${index + 1}`]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors[`option_${index + 1}`]?.message}
                </Form.Control.Feedback>
              </Form.Group>
            ))}
            <Form.Group>
              <Form.Label>Correct Answer</Form.Label>
              <StyledFormControl
                type="text"
                {...register("correct_answer")}
                isInvalid={!!errors.correct_answer}
              />
              <Form.Control.Feedback type="invalid">
                {errors.correct_answer?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Difficulty Level</Form.Label>
              <StyledFormControl
                type="text"
                {...register("difficulty_level")}
                isInvalid={!!errors.difficulty_level}
              />
              <Form.Control.Feedback type="invalid">
                {errors.difficulty_level?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

   
      <StyledPagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
        {generatePaginationItems()}
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </StyledPagination>
    </Container>
  );
};

export default SubjectiveQuestionsTable;
