import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import styled from "styled-components";
import scheduleTestStore from "../Store/ScheduleTestStore";
import useScheduleTest from "../Hooks/useScheduleTest";
import { useNavigate } from "react-router-dom";

const ScheduleTestTable = () => {
  const { fetchScheduleTests, getDetailedTestInfo } = useScheduleTest();
  const { data: schedules, error } = scheduleTestStore((state) => ({
    data: state.data,
    error: state.error,
  }));

  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchScheduleTests();
      } catch (err) {
        console.error("Failed to fetch scheduled tests:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchScheduleTests]);

  const navigate = useNavigate();

  const handleView = (testId, testDate, testTime, centerIds) => {
    // Set the view data
    setViewData({
      testId,
      testDate,
      testTime,
      centerIds
    });
    
    
    getDetailedTestInfo({
      testId,
      testDate,
      testTime,  
      centerIds
    });

    // Navigate to the detail page
    navigate(`/scheduletestdetail/${testId}/${testDate}/${testTime}`);
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <Heading>Scheduled Tests</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          <TableContainer>
            {loading ? (
              <LoadingSpinner>
                <Spinner animation="border" variant="primary" />
                Loading...
              </LoadingSpinner>
            ) : error ? (
              <ErrorMessage>Failed to load scheduled tests. Please try again later.</ErrorMessage>
            ) : (
              <StyledTable striped bordered hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Test Name</th>
                    <th>Test Date</th>
                    <th>Test Time</th>
                    <th>Total Centers</th>
                    <th>Total Capacity</th>
                    <th>Registered Students</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!schedules.length ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <NoDataMessage>No scheduled tests found</NoDataMessage>
                      </td>
                    </tr>
                  ) : (
                    schedules.map((schedule, index) => {
                      const testDate = new Date(schedule.testDate);
                      const testDateString = testDate.toLocaleDateString(); 
                  
                      return (
                        <tr key={index}>
                          <td data-label="No">{index + 1}</td>
                          <td data-label="Test Name">{schedule.testName}</td>
                          <td data-label="Test Date">{testDateString}</td>
                          <td data-label="Test Time">{schedule.testTime}</td>
                          <td data-label="Total Centers">{schedule.totalCenters}</td>
                          <td data-label="Total Capacity">{schedule.totalCapacity}</td>
                          <td data-label="Registered Students">{schedule.registeredStudents}</td>
                          <td>
                            <StyledButton
                              className="my-2"
                              variant="info"
                              onClick={() => handleView(schedule.testId, schedule.testDate, schedule.testTime,schedule.centerIds)}
                            >
                              View
                            </StyledButton>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </StyledTable>
            )}
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
      display: none; /* Hide table headers on small screens */
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

      &::before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 45%;
        padding-left: 10px;
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

const NoDataMessage = styled.div`
  color: #555;
  font-size: 1.2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.2rem;
  text-align: center;
`;

export default ScheduleTestTable;
