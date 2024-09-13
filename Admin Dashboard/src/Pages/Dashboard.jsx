import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";

import ScoreCards from "../Components/ScoreCard";
import StaticsCard from "../Components/StaticsCard";
import RequestsTable from "../Components/MainPageTable";


function Dashboard() {
  const studentStats = [
    { name: "Total Students", value: "500" },
    { name: "Verified Students", value: "400" },
    { name: "Pending Verification", value: "40" },
    { name: "Canceled Students", value: "40" },
    { name: "Enrolled For Test", value: "40" },
  ];

  const teacherStats = [
    { name: "Total Teachers", value: "100" },
    { name: "Total Questions", value: "100" },
    { name: "Added Questions", value: "100" },
    { name: "Remaining Questions", value: "100" },
  ];

  const testCenterStats = [
    { name: "Total Centers", value: "10" },
    { name: "Booked Upcoming", value: "3" },
    { name: "Booked Today", value: "1" },
    { name: "Standby", value: "6" },
  ];

  const requestData = [
    { testName: "Nut 1", testCenter: "Center A", subject: "Math", date: "2024-19-10" },
    { testName: "Apptitude Test", testCenter: "Center B", subject: "Science", date: "2024-29-12" },
    { testName: "History Test", testCenter: "Center C", subject: "History", date: "2024-19-15" },
    { testName: "Nut 1", testCenter: "Center A", subject: "Math", date: "2024-19-10" },
    { testName: "Apptitude Test", testCenter: "Center B", subject: "Science", date: "2024-29-12" },
    { testName: "History Test", testCenter: "Center C", subject: "History", date: "2024-19-15" },
    { testName: "Nut 1", testCenter: "Center A", subject: "Math", date: "2024-19-10" },
    { testName: "Apptitude Test", testCenter: "Center B", subject: "Science", date: "2024-29-12" },
    { testName: "History Test", testCenter: "Center C", subject: "History", date: "2024-19-15" },
    { testName: "Nut 1", testCenter: "Center A", subject: "Math", date: "2024-19-10" },
    { testName: "Apptitude Test", testCenter: "Center B", subject: "Science", date: "2024-29-12" },
    { testName: "History Test", testCenter: "Center C", subject: "History", date: "2024-19-15" },
  ];

  return (
    <>
    <DashboardPage>
      <Container fluid>
        <Row>
          <Col>
            <h1 className="mb-5 my-4">Dashboard</h1>
          </Col>
        </Row>
        <Row>
          <Col className="my-3" md={4} xs={12}>
            <ScoreCards heading="Total Tests" number="10" />
          </Col>
          <Col className="my-3" md={4} xs={12}>
            <ScoreCards heading="Upcoming Tests" number="50" />
          </Col>
          <Col className="my-3" md={4} xs={12}>
            <ScoreCards heading="Today's Tests" number="3" />
          </Col>
        </Row>

        <Row className="mt-5">
        <Col className="my-3" md={4} xs={12}>
            <StaticsCard heading="Teachers" stats={teacherStats} link="/teachers" />
          </Col>
          <Col className="my-3" md={4} xs={12}>
            <StaticsCard heading="Students" stats={studentStats} link="/students" />
          </Col>
        
          <Col className="my-3" md={4} xs={12}>
            <StaticsCard heading="Test Centers" stats={testCenterStats} link="/test-centers" />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <RequestsTable tablehead="Students Request List" requests={requestData} />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <RequestsTable tablehead="Paper Request List" requests={requestData} />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <RequestsTable tablehead="Result Submittion Request List" requests={requestData} />
          </Col>
        </Row>
       
      </Container>
    
    </DashboardPage>
    
</>
  );
}

const DashboardPage = styled.div`
  height: 93vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Enables smooth scrolling */
  
  /* Hide scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default Dashboard;
