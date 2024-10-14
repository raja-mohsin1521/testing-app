import React, { useState } from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import useTest from "../Hooks/useTest";
import TestStore from "../Store/TestStore";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  eligibility_criteria: z
    .string()
    .min(1, { message: "Eligibility criteria is required" }),
  difficulty_level: z.enum(["easy", "medium", "hard"], {
    message: "Difficulty level must be one of 'easy', 'medium', or 'hard'",
  }),
  number_of_questions: z
    .union([z.string().min(1).transform(Number), z.number()])
    .refine((value) => value > 0, {
      message: "Number of questions must be at least 1 and cannot be null",
    }),
});

const TestTable = () => {
  const { Tests } = TestStore((state) => ({
    Tests: state.data,
  }));

  const { updateTest, deleteTest } = useTest();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    subject: "",
    eligibility_criteria: "",
    difficulty_level: "",
    number_of_questions: "",
  });
  const [errors, setErrors] = useState({});
  const [showMoreId, setShowMoreId] = useState(null); 

  const handleEdit = (test) => {
    setEditingId(test.test_id);
    setEditData({
      name: test.test_name,
      subject: test.subject,
      eligibility_criteria: test.eligibility_criteria,
      difficulty_level: test.difficulty_level,
      number_of_questions: test.number_of_questions,
    });
    setErrors({});
  };

  const handleSave = () => {
    try {
     
      schema.parse(editData);

      
      if (editingId) {
        updateTest({
          id: editingId,
          name: editData.name,
          subject: editData.subject,
          eligibility_criteria: editData.eligibility_criteria,
          difficulty_level: editData.difficulty_level,
          number_of_questions: editData.number_of_questions,
        });
        setEditingId(null);
        setEditData({
          name: "",
          subject: "",
          eligibility_criteria: "",
          difficulty_level: "",
          number_of_questions: "",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
   
        const formattedErrors = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({
      name: "",
      subject: "",
      eligibility_criteria: "",
      difficulty_level: "",
      number_of_questions: "",
    });
    setErrors({});
  };

  const handleDelete = (id) => {
    deleteTest(id);
  };

  const toggleReadMore = (id) => {
    setShowMoreId(showMoreId === id ? null : id);
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <Heading>Test List</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          <TableContainer>
            <StyledTable striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Eligibility Criteria</th>
                  <th>Difficulty Level</th>
                  <th>Number of Questions</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Tests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <NoDataMessage>No test centers found</NoDataMessage>
                    </td>
                  </tr>
                ) : (
                  Tests.map((test, index) => (
                    <tr key={test.test_id}>
                      {" "}
                      {/* Use test_id here */}
                      <td data-label="ID">{index + 1}</td>{" "}
                      {/* Use test_id here */}
                      <td data-label="Name">
                        {editingId === test.test_id ? (
                          <>
                            <input
                              type="text"
                              name="name"
                              value={editData.name}
                              onChange={handleChange}
                            />
                            {errors.name && (
                              <ErrorMessage>{errors.name}</ErrorMessage>
                            )}
                          </>
                        ) : (
                          test.test_name
                        )}
                      </td>
                      <td data-label="Subject">
                        {editingId === test.test_id ? (
                          <>
                            <input
                              type="text"
                              name="subject"
                              value={editData.subject}
                              onChange={handleChange}
                            />
                            {errors.subject && (
                              <ErrorMessage>{errors.subject}</ErrorMessage>
                            )}
                          </>
                        ) : (
                          test.subject
                        )}
                      </td>
                      <td data-label="Eligibility Criteria">
                        {editingId === test.test_id ? (
                          <>
                            <textarea
                              name="eligibility_criteria"
                              value={editData.eligibility_criteria}
                              onChange={handleChange}
                              rows="3"
                            />
                            {errors.eligibility_criteria && (
                              <ErrorMessage>
                                {errors.eligibility_criteria}
                              </ErrorMessage>
                            )}
                          </>
                        ) : (
                          <>
                            {test.eligibility_criteria.length > 10 ? (
                              <>
                                {showMoreId === test.test_id
                                  ? test.eligibility_criteria
                                  : `${test.eligibility_criteria.substring(
                                      0,
                                      10
                                    )}...`}
                                <br/><Button
                                  variant="link"
                                  onClick={() => toggleReadMore(test.test_id)}
                                >
                                  {showMoreId === test.test_id
                                    ? "Show Less"
                                    : "Read More"}
                                </Button>
                              </>
                            ) : (
                              test.eligibility_criteria
                            )}
                          </>
                        )}
                      </td>
                      <td data-label="Difficulty Level">
                        {editingId === test.test_id ? (
                          <>
                            <input
                              type="text"
                              name="difficulty_level"
                              value={editData.difficulty_level}
                              onChange={handleChange}
                            />
                            {errors.difficulty_level && (
                              <ErrorMessage>
                                {errors.difficulty_level}
                              </ErrorMessage>
                            )}
                          </>
                        ) : (
                          test.difficulty_level
                        )}
                      </td>
                      <td data-label="Number of Questions">
                        {editingId === test.test_id ? (
                          <>
                            <input
                              type="number"
                              name="number_of_questions"
                              value={editData.number_of_questions}
                              onChange={handleChange}
                            />
                            {errors.number_of_questions && (
                              <ErrorMessage>
                                {errors.number_of_questions}
                              </ErrorMessage>
                            )}
                          </>
                        ) : (
                          test.number_of_questions
                        )}
                      </td>
                      <td>
                        {editingId === test.test_id ? (
                          <>
                            <StyledButton
                              className="my-2"
                              variant="success"
                              onClick={handleSave}
                            >
                              Save
                            </StyledButton>
                            <StyledButton
                              className="my-2"
                              variant="secondary"
                              onClick={handleCancel}
                            >
                              Cancel
                            </StyledButton>
                          </>
                        ) : (
                          <StyledButton
                            className="my-2 mx-2"
                            variant="warning"
                            onClick={() => handleEdit(test)}
                          >
                            Edit
                          </StyledButton>
                        )}
                        {editingId !== test.test_id && (
                          <StyledButton
                            className="my-2"
                            variant="danger"
                            onClick={() => handleDelete(test.test_id)}
                          >
                            Delete
                          </StyledButton>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </StyledTable>
          </TableContainer>
        </Col>
      </Row>
    </Container>
  );
};

const TableContainer = styled.div`
  overflow-x: auto; /* Add horizontal scrolling for responsiveness */
  max-height: 500px; /* Set a fixed height */
`;

const StyledTable = styled(Table)`
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th,
  td {
    text-align: center;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tbody {
      display: block;
      max-height: 80vh;
      overflow-y: auto;
    }

    tr {
      display: block;
      margin-bottom: 10px;
      border-bottom: 1px solid #dee2e6;
    }

    td {
      display: block;
      text-align: right;
      padding-left: 50%;
      position: relative;

      &::before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 45%;
        padding-left: 15px;
        font-weight: bold;
        text-align: left;
        white-space: nowrap;
      }
    }
  }
`;

const StyledButton = styled(Button)`
  margin: 2px 0;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const NoDataMessage = styled.div`
  color: #555;
  font-size: 1.2rem;
`;

export default TestTable;
