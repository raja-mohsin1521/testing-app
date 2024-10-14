import React, { useState } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { BookingStore } from "../Store/TestCenterStore";

const TestCenterBookingTable = () => {
  const bookings = BookingStore((state) => state.data);
  const length = bookings ? bookings.length : 0;

  const [sortConfig, setSortConfig] = useState({ key: "test_date", direction: "asc" });

  const sortedBookings = bookings.slice().sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (sortConfig.key === "test_date") {
      return (new Date(valueA) - new Date(valueB)) * (sortConfig.direction === "asc" ? 1 : -1);
    } else if (sortConfig.key === "test_time") {
      return valueA.localeCompare(valueB) * (sortConfig.direction === "asc" ? 1 : -1);
    } else {
      return valueA.localeCompare(valueB) * (sortConfig.direction === "asc" ? 1 : -1);
    }
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <Heading>Test Center Bookings</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          <TableContainer>
            <StyledTable striped bordered hover>
              <thead>
                <tr>
                  <SortableTh onClick={() => handleSort("index")}>No</SortableTh>
                  <SortableTh onClick={() => handleSort("test_name")}>Test Name</SortableTh>
                  <SortableTh onClick={() => handleSort("institute_name")}>Test Center</SortableTh>
                  <SortableTh onClick={() => handleSort("test_date")}>Test Date</SortableTh>
                  <SortableTh onClick={() => handleSort("test_time")}>Test Time</SortableTh>
                </tr>
              </thead>
              <tbody>
                {length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <NoDataMessage>No bookings found</NoDataMessage>
                    </td>
                  </tr>
                ) : (
                  sortedBookings.map((booking, index) => (
                    <StyledRow key={booking.id}>
                      <td data-label="No">{index + 1}</td>
                      <td data-label="Test Name">{booking.test_name}</td>
                      <td data-label="Test Center">{booking.institute_name}</td>
                      <td data-label="Test Date">
                        {new Date(booking.test_date).toISOString().split("T")[0]}
                      </td>
                      <td data-label="Test Time">{booking.test_time}</td>
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
    padding: 10px;
  }

  th {
    background-color: #343a40;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: sticky;
    top: 0;
    z-index: 1;
  }
 th:hover{
 background-color: black;
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

const Heading = styled.h2`
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
  font-weight: bold;
`;

const NoDataMessage = styled.div`
  color: #6c757d;
`;

const SortableTh = styled.th`
  &:hover {
    background-color: #495057;
    color: #ffffff;
  }
  &.asc::after {
    content: " ▲";
    font-size: 0.8em;
  }
  &.desc::after {
    content: " ▼";
    font-size: 0.8em;
  }
`;

const StyledRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
    transition: background-color 0.3s ease;
  }
`;

export default TestCenterBookingTable;
