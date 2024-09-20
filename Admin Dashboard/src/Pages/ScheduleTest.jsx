
import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import ScheduleTestForm from '../Components/ScheduleTestForm'
import ScheduleTestTable from '../Components/ScheduleTestTable';

function ScheduleTest() {
  const [showForm, setShowForm] = useState(false);

  return (
  <><FullHeightContainer fluid>
  {showForm && (
    <Row>
      <Col>
        <ScheduleTestForm setShowForm={setShowForm} />
      </Col>
    </Row>
  )}
  <Row className="text-end mb-3">
    <Col className={showForm ? 'mt-5' : ''}>
      <Button className='btn-dark' onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Schedule Test'}
      </Button>
    </Col>
  </Row>
  <hr/>
   <Row className='mt-5'>
    <Col>
     <ScheduleTestTable/>
    </Col>
  </Row>
 
</FullHeightContainer></>
  )
}
const FullHeightContainer = styled(Container)`
  height: 93.9vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ScheduleTest








