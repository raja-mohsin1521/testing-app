// src/pages/Teachers.js
import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import TeachersTable from '../Components/TeachersTable';
import TeacherForm from '../Components/TeacherForm';
import styled from 'styled-components';

const Teachers = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <FullHeightContainer fluid>
      {showForm && (
        <Row>
          <Col>
            <TeacherForm setShowForm={setShowForm} />
          </Col>
        </Row>
      )}
      <Row className="text-end mb-3">
        <Col className={showForm ? 'mt-5' : ''}>
          <Button className='btn-dark' onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Add Teacher'}
          </Button>
        </Col>
      </Row>
      <hr/>
      <Row className='mt-5'>
        <Col>
          <TeachersTable />
        </Col>
      </Row>
    </FullHeightContainer>
  );
};

const FullHeightContainer = styled(Container)`
  height: 93.9vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default Teachers;
