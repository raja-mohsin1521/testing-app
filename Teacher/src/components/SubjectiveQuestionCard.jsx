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
import useQuestion from "../Hooks/useQustions";
import FilterAndSort from "./FilterAndSort";

// Validation schema using Zod
const validationSchema = z.object({
  question_text: z.string().min(5, "Question must be at least 5 characters long"),
  difficulty_level: z.string().min(1, "Difficulty level is required"),
  notes: z.string().optional(),
  marks: z.number().min(1, "Marks must be at least 1"),
  course_name: z.string().min(1, "Course is required"),
  module_name: z.string().min(1, "Module is required"),
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
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .card-img-top {
    object-fit: cover;
    aspect-ratio: 4 / 1;
    border-radius: 10px 10px 0 0;
  }

  .card-body {
    padding: 20px;
  }

  .card-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 15px;
  }

  .card-text {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .card-footer {
    text-align: right;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 0 0 10px 10px;
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

const QuestionImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 5px;
  object-fit: cover;
  cursor: pointer;
`;

const SubjQuestionCard = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [filters, setFilters] = useState({ course: "", difficulty: "" });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [enlargedImage, setEnlargedImage] = useState(null);

  const { getSubjectiveQuestionsWithImages, deleteQuestion, fetchModules, fetchCourses } = useQuestion();

  const fetchData = async () => {
    try {
      const { subjective, total } = await getSubjectiveQuestionsWithImages(
        currentPage,
        filters.course,
        filters.difficulty,
        sortBy,
        sortOrder
      );

      if (!subjective || subjective.length === 0) {
        setQuestions([]);
        setTotalPages(0);
      } else {
        setQuestions(subjective);
        setTotalPages(Math.ceil(total / 4));
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setQuestions([]);
      setTotalPages(0);
    }
  };

  const getCourses = async () => {
    const courseList = await fetchCourses();
    setCourses(courseList);
  };

  useEffect(() => {
    fetchData();
    getCourses();
  }, [currentPage, filters, sortBy, sortOrder]);

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
    reset({
      ...question,
      course_id: question.course_id,
      module_id: question.module_id,
    });

    if (question.course_id) {
      fetchModules(question.course_id).then((relatedModules) => {
        setModules(relatedModules);
      });
    }

    setShowModal(true);
  };

  const handleSave = async (data) => {
    const token = localStorage.getItem("token");

    const selectedCourse = courses.find((course) => course.course_name === data.course_name);
    const course_id = selectedCourse ? selectedCourse.id : undefined;

    const selectedModule = modules.find((module) => module.module_name === data.module_name);
    const module_id = selectedModule ? selectedModule.id : undefined;

    const payload = {
      question_id: selectedQuestion.subj_question_id,
      course_id: course_id,
      module_id: module_id,
      question_text: data.question_text,
      difficulty_level: data.difficulty_level,
      notes: data.notes,
      marks: data.marks,
      token: token,
    };

    try {
      const updatedQuestion = await editSubjQuestion(payload);
      const updatedQuestions = questions.map((q) =>
        q.subj_question_id === selectedQuestion.subj_question_id ? updatedQuestion : q
      );
      setQuestions(updatedQuestions);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDelete = (id, type) => {
    deleteQuestion(id, type);
    setQuestions(questions.filter((q) => q.subj_question_id !== id));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    if (name === "sortBy") {
      setSortBy(value);
    } else if (name === "sortOrder") {
      setSortOrder(value);
    }
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
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
      <FilterAndSort
        courses={courses}
        filters={filters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <Row>
        {questions.length === 0 ? (
          <Col className="text-center">No Questions Found</Col>
        ) : (
          questions.map((q, index) => (
            <Col key={q.subj_question_id} xs={12} sm={6} md={4} lg={3}>
              <StyledCard>
                {q.image_url && (
                  <QuestionImage
                    src={`http://localhost:5000/${q.image_url}`}
                    alt="Question"
                    onClick={() => handleImageClick(`http://localhost:5000/${q.image_url}`)}
                  />
                )}
                <Card.Body>
                  <Card.Title className="text-center">{q.question_text}</Card.Title>
                  <Row>
                    <Col xs={12}>
                      <Card.Text>{`Marks: ${q.marks}`}</Card.Text>
                    </Col>
                    <Col xs={12}>
                      <Card.Text>{`Difficulty: ${q.difficulty_level}`}</Card.Text>
                    </Col>
                    <Col xs={12}>
                      <Card.Text>{`Course: ${q.course_name}`}</Card.Text>
                    </Col>
                    <Col xs={12}>
                      <Card.Text>{`Module: ${q.module_name}`}</Card.Text>
                    </Col>
                    <Col xs={12}>
                      <Card.Text>{`Notes: ${q.notes || "N/A"}`}</Card.Text>
                    </Col>
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
                    onClick={() => handleDelete(q.subj_question_id, 'sub')}
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
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <StyledFormControl
                as="textarea"
                rows={3}
                {...register("question_text")}
                isInvalid={!!errors.question_text}
              />
              <Form.Control.Feedback type="invalid">
                {errors.question_text?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Marks</Form.Label>
              <StyledFormControl
                type="number"
                {...register("marks", { valueAsNumber: true })}
                isInvalid={!!errors.marks}
              />
              <Form.Control.Feedback type="invalid">
                {errors.marks?.message}
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

            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <StyledFormControl
                as="textarea"
                rows={3}
                {...register("notes")}
                isInvalid={!!errors.notes}
              />
              <Form.Control.Feedback type="invalid">
                {errors.notes?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Course</Form.Label>
              <Form.Select
                {...register("course_name")}
                isInvalid={!!errors.course_name}
              >
                {courses.map((course, index) => (
                  <option key={index} value={course.course_name}>
                    {course.course_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.course_name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Module</Form.Label>
              <Form.Select
                {...register("module_name")}
                isInvalid={!!errors.module_name}
              >
                {modules.map((module, index) => (
                  <option key={index} value={module.module_name}>
                    {module.module_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.module_name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={!!enlargedImage} onHide={handleCloseEnlargedImage} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enlarged Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={enlargedImage} alt="Enlarged" style={{ width: '100%' }} />
        </Modal.Body>
      </Modal>

      <StyledPagination>{generatePaginationItems()}</StyledPagination>
    </Container>
  );
};

export default SubjQuestionCard;