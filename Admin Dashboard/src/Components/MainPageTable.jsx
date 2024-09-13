import React from 'react';
import { Table, Button, Row } from 'react-bootstrap';
import styled from 'styled-components';

const RequestsTable = (props) => {
  return (
    <TableContainer>
      <StyledTable>
        <Row className='d-md-none px-3 py-3 heading'>
          <h3>{props.tablehead}</h3>
        </Row>
        <thead>
          <tr>
            <th className='main' colSpan="6">
              <h3>{props.tablehead}</h3>
            </th>
          </tr>
          <tr>
            <th>Number</th>
            <th>Test Name</th>
            <th>Test Center</th>
            <th>Subject</th>
            <th>Date</th>
            <th colSpan={2}>Request</th>
          </tr>
        </thead>
        <tbody>
          {props.requests.length === 0 ? (
            <tr>
              <td colSpan="6">
                <NoDataMessage>No new requests found</NoDataMessage>
              </td>
            </tr>
          ) : (
            props.requests.map((request, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{request.testName}</td>
                <td>{request.testCenter}</td>
                <td>{request.subject}</td>
                <td>{request.date}</td>
                <td colSpan={2}>
                  <Button variant="success" className="my-2">Accept</Button>
                  <Button variant="danger">Decline</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}

const TableContainer = styled.div`
  overflow-x: auto; /* Enable horizontal scrolling if necessary */
  display: flex;
  justify-content: center; /* Center the table horizontally */
`;

const StyledTable = styled(Table)`
  background-color: #fff; /* Background color for the table */
  border: 1px solid #dee2e6; /* Border color */
  border-radius: 0.25rem; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
  width: 100%; /* Ensure the table takes full width */
  max-width: 1000px; /* Limit the maximum width of the table */
  
  .heading {
    background-color: #343a40;
    color: #ffc107;
  }
  
  th, td {
    text-align: center; /* Center text horizontally */
    vertical-align: middle; /* Center text vertically */
  }

  .main {
    background-color: #343a40; /* Background color for table header */
    color: #ffc107; /* Text color for table header */
  }

  th {
    background-color: #f8f9fa; /* Background color for table header */
    color: #495057; /* Text color for table header */
  }

  tbody {
    display: block;
    max-height: 300px; /* Set height for scrollable area */
    overflow-y: auto; /* Enable vertical scrolling */
    width: 100%; /* Ensure tbody takes full width */
  }

  tr {
    display: table;
    width: 100%;
    table-layout: fixed; /* Ensure table layout is fixed */
  }

  button {
    margin: 0 5px; /* Margin for buttons */
  }

  @media (max-width: 745px) {
    thead {
      display: none; /* Hide table header on small screens */
    }

    tbody {
      display: block;
      max-height: 300px; /* Set height for scrollable area */
      overflow-y: auto; /* Enable vertical scrolling */
    }

    tr {
      display: block;
      margin-bottom: 10px; /* Space between rows */
      border-bottom: 1px solid #dee2e6; /* Row border */
    }

    td {
      display: block;
      text-align: right; /* Align text to the right */
      position: relative;
      padding-left: 50%; /* Add padding for responsive labels */
      padding-right: 10px; /* Add padding for text */
      white-space: nowrap; /* Prevent text from wrapping */
    }

    td::before {
      content: attr(data-label); /* Add label before content */
      position: absolute;
      left: 0;
      width: 50%;
      padding-left: 10px; /* Padding for label */
      font-weight: bold;
      text-align: left; /* Align label to the left */
    }
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #6c757d;
  padding: 20px;
`;

export default RequestsTable;
