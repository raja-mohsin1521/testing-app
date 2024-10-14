import React, { useState, useRef } from 'react';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const StyledRow = styled(Row)`
  cursor: pointer;
  color: white;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #343a40, #495057);
  transition: background 0.3s ease;
  box-shadow: ${({ isSelected }) =>
    isSelected ? '0 0 10px rgba(0, 0, 0, 0.3)' : 'none'};

  &:hover {
    background: linear-gradient(135deg, #495057, #343a40);
  }
`;

const CenterDetails = styled.div`
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #ffffff;
`;

const Heading = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  color: #00796b;
`;

const SubHeading = styled.h3`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #004d40;
`;

const StyledTable = styled(Table)`
  thead {
    background-color: #007bff; 
    color: white;
  }

  tbody tr {
    transition: background-color 0.3s;
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

      &::before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 45%;
        padding-left: 10px;
        font-weight: bold;
        text-align: left;
      }
    }
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

    &::before {
      content: attr(data-label);
      position: absolute;
      left: 0;
      width: 45%;
      padding-left: 10px;
      font-weight: bold;
      text-align: left;
    }
  }
}

`;

const ScrollableContainer = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

const ScheduleTestDetails = () => {

  const { test_id, test_date, test_time } = useParams();

  console.log('Test ID:', test_id);
  console.log('Test Date:', test_date);
  console.log('Test Time:', test_time);


  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDates, setNewDates] = useState({
    registrationEndDate: '',
    testDate: '',
    testTime: '',
  });
  const tableRef = useRef(null);

  const data = {
    commonDetails: {
      registrationStartDate: '2024-09-16T19:00:00.000Z',
      registrationEndDate: '2024-09-17T19:00:00.000Z',
      testDate: '2024-09-18',
      testTime:"12:00",
      testName: 'Final Examination',
      testId: '5',
      subject: 'Advanced Computer Science',
      eligibilityCriteria:
        'Must have completed all prerequisites and have a GPA above 3.0',
      difficultyLevel: 'hard',
    },
    centers: [
      {
        centerName: 'Sir Sayed Institute University',
        centerAddress: 'h85 st 29 i9/1 Islamabad',
        centerCity: 'Islamabad',
        centerCapacity: 2222,
        totalRegisteredStudents: 150,
        centerId: '1',
        studentNames: ['John Doe', 'Jane Smith', 'Michael Johnson'],
        studentEmails: [
          'john.doe@example.com',
          'jane.smith@example.com',
          'michael.johnson@example.com',
        ],
        studentCNICs: [
          '12345-6789012-3',
          '23456-7890123-4',
          '34567-8901234-5',
        ],
      },
      {
        centerName: 'Sir Sayed Institute University',
        centerAddress: 'h85 st 29 i9/1 Islamabad',
        centerCity: 'Rawalpindi',
        centerCapacity: 222,
        totalRegisteredStudents: 80,
        centerId: '2',
        studentNames: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
        studentEmails: [
          'alice.johnson@example.com',
          'bob.smith@example.com',
          'charlie.brown@example.com',
        ],
        studentCNICs: [
          '54321-0987654-3',
          '65432-1098765-4',
          '76543-2109876-5',
        ],
      },
    ],
  };
  const navigate = useNavigate();
  function goBack(){
    navigate('/scheduled-tests')
  }

  const handleRowClick = (center) => {
    setSelectedCenter(center);

    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setNewDates({
      registrationEndDate: data.commonDetails.registrationEndDate,
      testDate: data.commonDetails.testDate,
      testTime: data.commonDetails.testTime,
    });
  };

  const handleSaveClick = () => {
  
    const centerIds = data.centers.map((center) => center.centerId);
  
   
    const updatedData = {
      testId: data.commonDetails.testId,
      centerIds: centerIds,
      ...newDates,
    };
  

    console.log('Updated Dates with all Center IDs:', updatedData);
  
  
    setIsEditing(false);
  };
  
  const handleDateChange = (e) => {

    const updatedDates = {
      ...newDates,
      [e.target.name]: e.target.value,
    };
    setNewDates(updatedDates);
  
 
    const centerIds = data.centers.map((center) => center.centerId);
  

    const logData = {
      testDate: updatedDates.testDate,  
      testTime: updatedDates.testTime, 
      centerIds: centerIds,
    };
  
    console.log('Updated Date on Change:', logData);
  };
  
  return (
    <StyledContainer>
      <Button className="btn-dark" onClick={goBack} >Back</Button>

      <Heading>Test Details</Heading>

      <Row>
        <Col>
          <CenterDetails>
            <Row>
              <Col xs={12} md={6}>
                <p>
                  <strong>Test Name:</strong> {data.commonDetails.testName}
                </p>
              </Col>
              <Col xs={12} md={6}>
                <p>
                  <strong>Subject:</strong> {data.commonDetails.subject}
                </p>
              </Col>
             
              <Col xs={12} md={6}>
                <p>
                  <strong>Difficulty Level:</strong>{' '}
                  {data.commonDetails.difficultyLevel}
                </p>
              </Col>

              {!isEditing ? (
                <>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Registration Start Date:</strong>{' '}
                      {data.commonDetails.registrationStartDate}
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Registration End Date:</strong>{' '}
                      {data.commonDetails.registrationEndDate}
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Test Date </strong>{' '}
                      {data.commonDetails.testDate}
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Test Time </strong>{' '}
                      {data.commonDetails.testTime}
                    </p>
                  </Col>
                  <Col xs={12} >
                <p>
                  <strong>Eligibility Criteria:</strong>{' '}
                  {data.commonDetails.eligibilityCriteria}
                </p>
              </Col>
                  <Col xs={12}>
                    <Button onClick={handleEditClick} className="btn-warning">
                      Edit Dates
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Registration Start Date:</strong>{' '}
                      {data.commonDetails.registrationStartDate}
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Registration End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="registrationEndDate"
                        value={newDates.registrationEndDate}
                        onChange={handleDateChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Test Date </Form.Label>
                      <Form.Control
                        type="date"
                        name="testDate"
                        value={newDates.testDate}
                        onChange={handleDateChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label>Test Time </Form.Label>
                      <Form.Control
                        type="time"
                        name="testTime"
                        value={newDates.testTime}
                        onChange={handleDateChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                <p>
                  <strong>Eligibility Criteria:</strong>{' '}
                  {data.commonDetails.eligibilityCriteria}
                </p>
              </Col>
                  <Col xs={12}>
                    <Button onClick={handleSaveClick} className="btn-success">
                      Save Dates
                    </Button>
                  </Col>
                </>
              )}
              
            </Row>
          </CenterDetails>
        </Col>
      </Row>

      <Heading>Centers</Heading>
      {data.centers.map((center, index) => (
        <StyledRow
          key={index}
          isSelected={selectedCenter === center}
          onClick={() => handleRowClick(center)}
        >
          <Col>
            <h4 style={{ color: '#ffc107' }}>{center.centerName}</h4>

            <Row>
              <Col>
                <p>
                  <strong>Address:</strong> {center.centerAddress}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>City:</strong> {center.centerCity}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Capacity:</strong> {center.centerCapacity}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Registered Students:</strong>{' '}
                  {center.totalRegisteredStudents}
                </p>
              </Col>
            </Row>
          </Col>
        </StyledRow>
      ))}

      {selectedCenter && (
        <>
          <SubHeading>Registered Students</SubHeading>
          <ScrollableContainer ref={tableRef}>
            <h5>{selectedCenter.centerName} ({selectedCenter.centerCity})</h5>
            <StyledTable striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>CNIC</th>
                </tr>
              </thead>
              <tbody>
                {selectedCenter.studentNames.map((name, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td data-label="Name">{name}</td>
                    <td data-label="Email">{selectedCenter.studentEmails[index]}</td>
                    <td data-label="CNIC">{selectedCenter.studentCNICs[index]}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </ScrollableContainer>
        </>
      )}
    </StyledContainer>
  );
};

export default ScheduleTestDetails;
