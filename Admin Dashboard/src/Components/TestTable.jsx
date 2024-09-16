import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import useTest from '../Hooks/useTest';
import TestStore from '../Store/TestStore';

const TestTable = () => {
  const { Tests } = TestStore((state) => ({
    Tests: state.data
  }));

  const { updateTest, deleteTest } = useTest();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    subject: '',
    eligibility_criteria: '',
    difficulty_level: '',
    number_of_questions: ''
  });

  const handleEdit = (test) => {
    setEditingId(test.test_id); // Use test_id here
    setEditData({
      name: test.test_name,
      subject: test.subject,
      eligibility_criteria: test.eligibility_criteria,
      difficulty_level: test.difficulty_level,
      number_of_questions: test.number_of_questions
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateTest({
        id: editingId,
        name: editData.name,
        subject: editData.subject,
        eligibility_criteria: editData.eligibility_criteria,
        difficulty_level: editData.difficulty_level,
        number_of_questions: editData.number_of_questions
      });
      setEditingId(null);
      setEditData({
        name: '',
        subject: '',
        eligibility_criteria: '',
        difficulty_level: '',
        number_of_questions: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({
      name: '',
      subject: '',
      eligibility_criteria: '',
      difficulty_level: '',
      number_of_questions: ''
    });
  };

  const handleDelete = (id) => {
    deleteTest(id);
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
                  <th>ID</th>
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
                  Tests.map((test) => (
                    <tr key={test.test_id}> {/* Use test_id here */}
                      <td data-label="ID">{test.test_id}</td> {/* Use test_id here */}
                      <td data-label="Name">
                        {editingId === test.test_id ? (
                          <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleChange}
                          />
                        ) : (
                          test.test_name
                        )}
                      </td>
                      <td data-label="Subject">
                        {editingId === test.test_id ? (
                          <input
                            type="text"
                            name="subject"
                            value={editData.subject}
                            onChange={handleChange}
                          />
                        ) : (
                          test.subject
                        )}
                      </td>
                      <td data-label="Eligibility Criteria">
                        {editingId === test.test_id ? (
                          <textarea
                            name="eligibility_criteria"
                            value={editData.eligibility_criteria}
                            onChange={handleChange}
                            rows="3"
                          />
                        ) : (
                          test.eligibility_criteria
                        )}
                      </td>
                      <td data-label="Difficulty Level">
                        {editingId === test.test_id ? (
                          <input
                            type="text"
                            name="difficulty_level"
                            value={editData.difficulty_level}
                            onChange={handleChange}
                          />
                        ) : (
                          test.difficulty_level
                        )}
                      </td>
                      <td data-label="Number of Questions">
                        {editingId === test.test_id ? (
                          <input
                            type="number"
                            name="number_of_questions"
                            value={editData.number_of_questions}
                            onChange={handleChange}
                          />
                        ) : (
                          test.number_of_questions
                        )}
                      </td>
                      <td>
                        {editingId === test.test_id ? (
                          <>
                            <StyledButton className="my-2" variant="success" onClick={handleSave}>
                              Save
                            </StyledButton>
                            <StyledButton className="my-2" variant="secondary" onClick={handleCancel}>
                              Cancel
                            </StyledButton>
                          </>
                        ) : (
                          <StyledButton className="my-2" variant="warning" onClick={() => handleEdit(test)}>
                            Edit
                          </StyledButton>
                        )}
                        {editingId !== test.test_id && (
                          <StyledButton className="my-2" variant="danger" onClick={() => handleDelete(test.test_id)}>
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

  th, td {
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
      position: relative;
      padding-left: 50%;
      padding-right: 10px;
      white-space: nowrap;
    }

    td::before {
      content: attr(data-label);
      position: absolute;
      left: 0;
      width: 50%;
      padding-left: 10px;
      font-weight: bold;
      text-align: left;
    }
  }
`;

const Heading = styled.h2`
  text-align: center;
  color: #333;
`;

const NoDataMessage = styled.p`
  color: #888;
`;

const StyledButton = styled(Button)`
  margin: 0 5px;
`;

export default TestTable;
