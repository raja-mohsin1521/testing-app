import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Modal,
  Pagination,
  Card,
  Row,
  Col,
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

const Container = styled.div`
  padding: 20px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StyledCard = styled(Card)`
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .card-img-top ,img{
    object-fit: cover;
   
      aspect-ratio: 4 / 1;
     
  }

  .card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-title {
    font-weight: bold;
    font-size: 18px;
  }

  .card-text {
    font-size: 14px;
    margin: 10px 0;
  }

  .card-footer {
    text-align: right;
    padding: 10px;
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

const ObjQuestionCard = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { getObjectiveQuestionsWithImages, deleteQuestion } = useQuestion();

  useEffect(() => {
    const fetchData = async () => {
      const { objective, total } = await getObjectiveQuestionsWithImages(currentPage);
      
     
      setQuestions(objective);
      setTotalPages(Math.ceil(total / 4));
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
      q.obj_question_id === selectedQuestion.obj_question_id ? { ...selectedQuestion, ...data } : q
    );
    setQuestions(updatedQuestions);
    setShowModal(false);
  };

  const handleDelete = (id, type) => {
    deleteQuestion(id, type);
    setQuestions(questions.filter((q) => q.obj_question_id !== id));
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
   
      <Row>
        {questions?.length === 0 ? (
          <Col>No Questions Found</Col>
        ) : (
          
          questions?.map((q, index) => (
            <Col key={q.obj_question_id} xs={12} sm={6}>
            <StyledCard>
              {q.image_url && <Card.Img variant="top" src={`http://localhost:5000/${q.image_url}`} />}
              <Card.Body>
                <Card.Title className="text-center">{q.question_text}</Card.Title>
<Row>
                <Col  xs={12} sm={6}><Card.Text>
                  {`Option 1: ${q.option_1}`}
                  {q.option_1_image && (
                    <img
                      src={`http://localhost:5000/${q.option_1_image}`}
                      alt="Option 1"
                      style={{ maxWidth: '100%', marginTop: '5px' }}
                    />
                  )}
                </Card.Text></Col>
                <Col  xs={12} sm={6}>  <Card.Text>
                  {`Option 2: ${q.option_2}`}
                  {q.option_2_image && (
                    <img
                      src={`http://localhost:5000/${q.option_2_image}`}
                      alt="Option 2"
                      style={{ maxWidth: '100%', marginTop: '5px' }}
                    />
                  )}
                </Card.Text></Col>
                <Col  xs={12} sm={6}> <Card.Text>
                  {`Option 3: ${q.option_3}`}
                  {q.option_3_image && (
                    <img
                      src={`http://localhost:5000/${q.option_3_image}`}
                      alt="Option 3"
                      style={{ maxWidth: '100%', marginTop: '5px' }}
                    />
                  )}
                </Card.Text></Col>
                <Col  xs={12} sm={6}>      <Card.Text>
                  {`Option 4: ${q.option_4}`}
                  {q.option_4_image && (
                    <img
                      src={`http://localhost:5000/${q.option_4_image}`}
                      alt="Option 4"
                      style={{ maxWidth: '100%', marginTop: '5px' }}
                    />
                  )}
                </Card.Text></Col>
                
              
               
          
                <Col  xs={12} sm={6}> <Card.Text>{`Correct Answer: ${q.correct_answer}`}</Card.Text> </Col>
                <Col  xs={12} sm={6}><Card.Text>{`Difficulty: ${q.difficulty_level}`}</Card.Text> </Col>
                <Col  xs={12} sm={6}><Card.Text>{`Course: ${q.course_name}`}</Card.Text> </Col>
                <Col  xs={12} sm={6}>  <Card.Text>{`Module: ${q.module_name}`}</Card.Text></Col>
               
                
                
               
               
                </Row>
              </Card.Body>
              <Card.Footer>
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
                  onClick={() => handleDelete(q.obj_question_id, 'obj')}
                >
                  Delete
                </Button>
              </Card.Footer>
            </StyledCard>
          </Col>
          
          ))
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleSave)}>
            <StyledFormControl
              type="text"
              placeholder="Question"
              {...register("text")}
              isInvalid={!!errors.text}
            />
            {errors.text && <div className="invalid-feedback">{errors.text.message}</div>}

            <StyledFormControl
              type="text"
              placeholder="Option 1"
              {...register("options[0]")}
              isInvalid={!!errors.options?.[0]}
            />
            {errors.options?.[0] && <div className="invalid-feedback">{errors.options[0].message}</div>}

            <StyledFormControl
              type="text"
              placeholder="Option 2"
              {...register("options[1]")}
              isInvalid={!!errors.options?.[1]}
            />
            {errors.options?.[1] && <div className="invalid-feedback">{errors.options[1].message}</div>}

            <StyledFormControl
              type="text"
              placeholder="Option 3"
              {...register("options[2]")}
              isInvalid={!!errors.options?.[2]}
            />
            {errors.options?.[2] && <div className="invalid-feedback">{errors.options[2].message}</div>}

            <StyledFormControl
              type="text"
              placeholder="Option 4"
              {...register("options[3]")}
              isInvalid={!!errors.options?.[3]}
            />
            {errors.options?.[3] && <div className="invalid-feedback">{errors.options[3].message}</div>}

            <StyledFormControl
              type="text"
              placeholder="Correct Answer"
              {...register("answer")}
              isInvalid={!!errors.answer}
            />
            {errors.answer && <div className="invalid-feedback">{errors.answer.message}</div>}

            <StyledFormControl
              type="text"
              placeholder="Difficulty"
              {...register("difficulty")}
              isInvalid={!!errors.difficulty}
            />
            {errors.difficulty && <div className="invalid-feedback">{errors.difficulty.message}</div>}

            <Button type="submit" variant="primary" className="mt-3">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <StyledPagination>{generatePaginationItems()}</StyledPagination>
    </Container>
  );
};

export default ObjQuestionCard;
