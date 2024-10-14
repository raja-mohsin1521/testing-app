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

  const [loading, setLoading] = useState(true);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  useEffect(() => {
    const loadData = async () => {
      if (schedules.length === 0) {
        try {
          await fetchScheduleTests();
        } catch (err) {
          console.error("Failed to fetch scheduled tests:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setSortedData(schedules);
  }, [schedules]);

  const navigate = useNavigate();

  const handleView = (testId, testDate, testTime, centerIds) => {
    getDetailedTestInfo({ testId, testDate, testTime, centerIds });
    navigate(`/scheduletestdetail/${testId}/${testDate}/${testTime}`);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedArray = [...schedules].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setSortedData(sortedArray);
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
              <ErrorMessage>
                Failed to load scheduled tests. Please try again later.
              </ErrorMessage>
            ) : (
              <StyledTable striped bordered hover>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("index")}>No</th>
                    <th onClick={() => handleSort("testName")}>Test Name</th>
                    <th onClick={() => handleSort("testDate")}>Test Date</th>
                    <th onClick={() => handleSort("testTime")}>Test Time</th>
                    <th onClick={() => handleSort("totalCenters")}>Total Centers</th>
                    <th onClick={() => handleSort("totalCapacity")}>Total Capacity</th>
                    <th onClick={() => handleSort("registeredStudents")}>Registered Students</th>
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
                    sortedData.map((schedule, index) => {
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
                              onClick={() =>
                                handleView(
                                  schedule.testId,
                                  schedule.testDate,
                                  schedule.testTime,
                                  schedule.centerIds
                                )
                              }
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

// Styling remains unchanged
const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 500px;
  background-color: #f8f9fa; /* Light background for the table container */
  border-radius: 0.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled(Table)`
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th,
  td {
    text-align: center;
    vertical-align: middle;
    cursor: pointer; /* Indicate that the header is clickable */
    padding: 12px; /* Add padding for better spacing */
  }

  th {
    background-color: black; /* Bootstrap primary color */
    color: white;
    position: relative;
  }

  th:hover {
    background-color: #343a40; /* Darker blue on hover */
  }

  tbody tr:hover {
    background-color: #f1f1f1; /* Light gray on row hover */
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
