import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useStore } from "../Store/TeachersStore";
import useTeacher from "../Hooks/useTeacher";
import { useNavigate } from "react-router-dom";

const TeachersTable = () => {
  const { readTeachers, deleteTeacher } = useTeacher();
  
  useEffect(() => {
    readTeachers();
  }, []);

  const { teachers } = useStore((state) => ({
    teachers: state.teachers,
  }));

  const [localTeachers, setLocalTeachers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    setLocalTeachers(teachers);
  }, [teachers]);
  
  const navigate = useNavigate();

  const handleView = (teacherId) => {
    navigate(`/teachers/${teacherId}`);
  };

  const handleDelete = (teacherId) => {
    const updatedTeachers = localTeachers.filter((teacher) => teacher.teacher_id !== teacherId);
    deleteTeacher(teacherId);
    setLocalTeachers(updatedTeachers);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedTeachers = [...localTeachers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setLocalTeachers(sortedTeachers);
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <Heading>Teachers List</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          <TableContainer>
            <StyledTable striped bordered hover>
              <thead>
                <tr>
                  <SortableTh onClick={() => handleSort("id")}>ID {getSortArrow("id")}</SortableTh>
                  <SortableTh onClick={() => handleSort("email")}>
                    Email {getSortArrow("email")}
                  </SortableTh>
                  <SortableTh onClick={() => handleSort("subject_specialization")}>
                    Specialization {getSortArrow("subject_specialization")}
                  </SortableTh>
                  <SortableTh onClick={() => handleSort("required_questions")}>
                    Total Questions {getSortArrow("required_questions")}
                  </SortableTh>
                  <SortableTh onClick={() => handleSort("total_questions")}>
                    Added Questions {getSortArrow("total_questions")}
                  </SortableTh>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <NoDataMessage>No teachers found</NoDataMessage>
                    </td>
                  </tr>
                ) : (
                  localTeachers.map((teacher, index) => (
                    <StyledRow key={teacher.teacher_id}>
                      <td>{index + 1}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.subject_specialization}</td>
                      <td>{teacher.required_questions}</td>
                      <td>{teacher.total_questions}</td>
                      <td>
                        <StyledButton
                          variant="dark"
                          onClick={() => handleView(teacher.teacher_id)}
                        >
                          View
                        </StyledButton>
                        <StyledButton
                          variant="danger"
                          onClick={() => handleDelete(teacher.teacher_id)}
                        >
                          Delete
                        </StyledButton>
                      </td>
                    </StyledRow>
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

const Heading = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
  font-weight: bold;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
    padding: 12px;
  }
  th {
    background-color: #343a40; /* Bootstrap primary color */
    color: white;

      color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  th:hover {
    background-color: black; /* Darker blue on hover */
  }
  th {

    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: sticky;
    top: 0;
    z-index: 1;
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
      color: #6c757d;
    }
  }
`;

const SortableTh = styled.th`
  &:hover {
    background-color: #495057;
    color: #ffffff;
  }
`;

const StyledRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
    transition: background-color 0.3s ease;
  }
`;

const NoDataMessage = styled.div`
  font-size: 18px;
  color: #6c757d;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  margin: 0 5px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  &:hover {
    opacity: 0.8;
  }
`;

export default TeachersTable;
