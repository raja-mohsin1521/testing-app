import React, { useEffect, useState } from "react";
import { Table, Pagination, Button, Modal, Form } from "react-bootstrap";
import styled from "styled-components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useQuestion from "../Hooks/useQustions";
import FilterAndSort from "./FilterAndSort"; // Import the FilterAndSort component

const validationSchema = z.object({
  question_text: z.string().min(5, "Question must be at least 5 characters long"),
  difficulty_level: z.string().min(1, "Difficulty level is required"),
  course_id: z.string().min(1, "Course is required"),
  module_id: z.string().min(1, "Module is required"),
  notes: z.string().optional(),
  marks: z.number().min(1, "Marks must be at least 1"),
});

const Container = styled.div`
  padding: 20px;
  overflow-x: scroll;
  margin: auto;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled(Table)`
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow-x: scroll;
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
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [filters, setFilters] = useState({ course: "", difficulty: "" });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { getSubjectiveQuestionsWithoutImages, updateSubQuestion, deleteQuestion, fetchModules, fetchCourses } = useQuestion();

  const fetchData = async () => {
    try {
      const { subjective, total } = await getSubjectiveQuestionsWithoutImages(
        currentPage,
        filters.course,
        filters.difficulty,
        sortBy,
        sortOrder
      );
  
      // Reset questions if no data is returned
      if (!subjective || subjective.length === 0) {
        setQuestions([]);
        setTotalPages(0);
      } else {
        setQuestions(subjective);
        setTotalPages(Math.ceil(total / 25));
      }
    } catch (err) {
      console.error("Error fetching subjective questions:", err);
      setQuestions([]); // Reset questions in case of error
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const handleEdit = async (question) => {
    setSelectedQuestion({ ...question });
    setValue("question_text", question.question_text);
    setValue("difficulty_level", question.difficulty_level);
    setValue("course_id", question.course_id);
    setValue("module_id", question.module_id);
    setValue("marks", question.marks);
    setValue("notes", question.notes);

    if (question.course_id) {
      const relatedModules = await fetchModules(question.course_id);
      setModules(relatedModules);
    }

    setShowModal(true);
  };

  const handleSave = async (data) => {
    const token = localStorage.getItem("token");
    const payload = {
      question_id: selectedQuestion.subj_question_id,
      course_id: data.course_id,
      module_id: data.module_id,
      question_text: data.question_text,
      difficulty_level: data.difficulty_level,
      marks: data.marks,
      notes: data.notes,
      token: token,
    };

    await updateSubQuestion(payload);
    await fetchData();
    setShowModal(false);
  };

  const handleDelete = (id, type) => {
    deleteQuestion(id, type);
    setQuestions(questions.filter((q) => q.subj_question_id !== id));
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setValue("course_id", courseId);
    const relatedModules = await fetchModules(courseId);
    setModules(relatedModules);
    setValue("module_id", "");
  };

  const handleModuleChange = (e) => {
    const moduleId = e.target.value;
    setValue("module_id", moduleId);
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
      {/* Filter and Sort Component */}
      <FilterAndSort
        courses={courses}
        filters={filters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Table */}
      <StyledTable striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Question</th>
            <th>Difficulty Level</th>
            <th>Course</th>
            <th>Module</th>
            <th>Marks</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="8">No Questions Found</td>
            </tr>
          ) : (
            questions.map((q, index) => (
              <tr key={q.subj_question_id}>
                <th>{(currentPage - 1) * 25 + (index + 1)}</th>
                <td>{q.question_text}</td>
                <td>{q.difficulty_level}</td>
                <td>{q.course_name}</td>
                <td>{q.module_name}</td>
                <td>{q.marks}</td>
                <td>{q.notes}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(q)}
                    className="mx-2 my-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(q.subj_question_id, "sub")}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
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
              <Form.Label>Difficulty Level</Form.Label>
              <Form.Select {...register("difficulty_level")} isInvalid={!!errors.difficulty_level}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.difficulty_level?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Course</Form.Label>
              <Form.Select
                {...register("course_id")}
                onChange={handleCourseChange}
                isInvalid={!!errors.course_id}
              >
                {courses.map((course, index) => (
                  <option key={index} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.course_id?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Module</Form.Label>
              <Form.Select
                {...register("module_id")}
                onChange={handleModuleChange}
                isInvalid={!!errors.module_id}
              >
                {modules.map((m, index) => (
                  <option key={index} value={m.id}>
                    {m.module_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.module_id?.message}
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

      {/* Pagination */}
      <StyledPagination>{generatePaginationItems()}</StyledPagination>
    </Container>
  );
};

export default SubjectiveQuestionsTable;