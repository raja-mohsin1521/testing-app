import React, { useState } from "react";
import { Table, Button, Row } from "react-bootstrap";
import styled from "styled-components";

const RequestsTable = (props) => {
  const { requests = [] } = props;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedRequests = [...requests].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    props.onSort(sortedRequests); // Pass sorted requests up if needed
  };

  return (
    <TableContainer>
      <StyledTable>
        <Row className="d-md-none px-3 py-3 heading">
          <h3>{props.tablehead}</h3>
        </Row>
        <thead>
          <tr>
            <th className="main" colSpan="6">
              <h3>{props.tablehead}</h3>
            </th>
          </tr>
          <tr>
            {["Number", "Test Name", "Test Center", "Subject", "Date"].map((header) => (
              <th key={header} onClick={() => handleSort(header.toLowerCase().replace(" ", ""))}>
                {header}
              </th>
            ))}
            <th colSpan={2}>Request</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="6">
                <NoDataMessage>No new requests found</NoDataMessage>
              </td>
            </tr>
          ) : (
            requests.map((request, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{request.testName}</td>
                <td>{request.testCenter}</td>
                <td>{request.subject}</td>
                <td>{request.date}</td>
                <td colSpan={2}>
                  <Button variant="success" className="my-2">
                    Accept
                  </Button>
                  <Button variant="danger">Decline</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  overflow-x: auto;
  display: flex;
  justify-content: center;
  padding: 20px; /* Added padding around the table */
`;

const StyledTable = styled(Table)`
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px; /* Increased width */
  margin: 20px 0; /* Margin for spacing */

  th {
    background-color: #343a40; /* Header background color */
    color: #ffc107; /* Header text color */
    text-align: center;
    vertical-align: middle;
    padding: 16px; /* Increased padding for better spacing */
    cursor: pointer; /* Indicate that headers are clickable */
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #495057; /* Darker on hover */
    }
  }

  tbody {
    display: block;
    max-height: 400px; /* Increased height for better scroll */
    overflow-y: auto;
    width: 100%;
  }

  tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f8f9fa; /* Light gray on row hover */
    }
  }

  td {
    text-align: center;
    vertical-align: middle;
    padding: 16px; /* Increased padding for better spacing */
    border-bottom: 1px solid #dee2e6; /* Added bottom border for separation */
  }

  button {
    margin: 0 5px;
    font-weight: bold; /* Added bold font for buttons */
  }

  @media (max-width: 745px) {
    thead {
      display: none; /* Hide headers on small screens */
    }

    tbody {
      display: block;
      max-height: 300px;
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

const NoDataMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #6c757d;
  padding: 20px;
`;

export default RequestsTable;
