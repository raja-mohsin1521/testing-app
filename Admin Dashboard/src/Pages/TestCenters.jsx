// src/pages/TestCenters.js
import React, { useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import styled from 'styled-components';

import TestCenterForm from '../Components/TestCenterForm';
import TestCenterBookingTable from '../Components/TestCenterBookingTable';
import TestCenterTable from '../Components/TesTCenterTable';

const TestCenters = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <FullHeightContainer fluid>
      {showForm && (
        <Row>
          <Col>
            <TestCenterForm setShowForm={setShowForm} />
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
          <TestCenterTable />
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col>
          <TestCenterBookingTable  />
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

export default TestCenters;
