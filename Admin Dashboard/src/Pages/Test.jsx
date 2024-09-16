
import React, { useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import styled from 'styled-components';

import TestForm from '../Components/TestForm';

import TestTable from '../Components/TestTable';

const Test = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <FullHeightContainer fluid>
      {showForm && (
        <Row>
          <Col>
            <TestForm setShowForm={setShowForm} />
          </Col>
        </Row>
      )}
      <Row className="text-end mb-3">
        <Col className={showForm ? 'mt-5' : ''}>
          <Button className='btn-dark' onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Add Test Center'}
          </Button>
        </Col>
      </Row>
      <hr/>
       <Row className='mt-5'>
        <Col>
          <TestTable />
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

export default Test;
