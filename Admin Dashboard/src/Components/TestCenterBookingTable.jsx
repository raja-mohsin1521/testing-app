import React from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { BookingStore } from '../Store/TestCenterStore'; 

const TestCenterBookingTable = () => {
  
  const bookings = BookingStore((state) => state.data); 
  const length = bookings ? bookings.length : 0; // default to 0 if bookings is undefined

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
                  <th>No</th>
                  <th>Test Date</th>
                  <th>Test Center</th>
                  <th>Test Name</th>
                  <th>Booking Status</th>
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
                  bookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td data-label="No">{index + 1}</td>
                      <td data-label="Test Date">{booking.testDate}</td>
                      <td data-label="Test Center">{booking.testCenter}</td>
                      <td data-label="Test Name">{booking.testName}</td>
                      <td data-label="Booking Status">{booking.status}</td>
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

const Heading = styled.h2`
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
`;

const NoDataMessage = styled.div`
  color: #6c757d;
`;

export default TestCenterBookingTable;
