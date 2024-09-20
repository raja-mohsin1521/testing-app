import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useStore } from '../Store/TeachersStore';
import useTeacher from '../Hooks/useTeacher';
const TeachersTable = () => {

  const {readTeachers,deleteTeacher}=useTeacher()
  useEffect(() => {
   
     readTeachers();
    
    },[]);

  // Example usage
  const { teachers } = useStore((state) => ({
    teachers: state.teachers,
  }));
  
  // Local state to manage table data
  const [localTeachers, setLocalTeachers] = useState([]);

  useEffect(() => {
    // Set local state with the initial teachers data from the store
    setLocalTeachers(teachers);
  }, [teachers]);

  // Handle the view action
  const handleView = (teacher) => {
    console.log('View', teacher);
  };

  // Handle the delete action locally
  const handleDelete = (teacherId) => {
    const updatedTeachers = localTeachers.filter((teacher) => teacher.id !== teacherId);
    deleteTeacher(teacherId)
    setLocalTeachers(updatedTeachers); // Update the local state
    console.log('Deleted teacher with id:', teacherId);
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
                  <th>ID</th>
               
                  <th>Email</th>
                  <th>Specialization
                  </th>
                  <th>Total Questions</th>
                  <th>Added Questions</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <NoDataMessage className="text-center">No teachers found</NoDataMessage>
                    </td>
                  </tr>
                ) : (
                  localTeachers.map((teacher,index) => (
                    <tr key={teacher.teacher_id}>
                      <td>{index+1}</td>
                   
                      <td>{teacher.email}</td>
                      <td>{teacher.subject_specialization
                      }</td>
                      <td>{teacher.required_questions}</td>
                      <td>{teacher.total_questions}</td>
                      <td>
                        <StyledButton variant="dark" className='mx-2 my-2' onClick={() => handleView(teacher.teacher_id)}>
                          View
                        </StyledButton>
                        <StyledButton variant="danger" onClick={() => handleDelete(teacher.teacher_id)}>
                          Delete
                        </StyledButton>
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

const Heading = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
`;

const TableContainer = styled.div`
  overflow-x: auto;
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

const NoDataMessage = styled.div`
  font-size: 18px;
  color: #6c757d;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  margin: 0 5px;
`;

export default TeachersTable;
