// src/Pages/Dashboard.jsx
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';

import ScoreCardSkeleton from '../Skeleton/ScoreCardSkeleton';
import StaticsCardSkeleton from '../Skeleton/StaticsCardSkeleton';
import RequestsTableSkeleton from '../Skeleton/RequestsTableSkeleton';
import ScoreCards from '../Components/ScoreCard';
import StaticsCard from '../Components/StaticsCard';
import RequestsTable from '../Components/MainPageTable';
import useDashboard from '../Hooks/useDashboard';

function Dashboard() {
  const { dashboard, loading, error } = useDashboard(); // Call the hook here

  if (loading) {
    return (
      <DashboardPage>
        <Container fluid>
          <Row>
            <Col className="my-3" md={4} xs={12}>
              <ScoreCardSkeleton />
            </Col>
            <Col className="my-3" md={4} xs={12}>
              <ScoreCardSkeleton />
            </Col>
            <Col className="my-3" md={4} xs={12}>
              <ScoreCardSkeleton />
            </Col>
          </Row>

          <Row className="mt-5">
            <Col className="my-3" md={4} xs={12}>
              <StaticsCardSkeleton />
            </Col>
            <Col className="my-3" md={4} xs={12}>
              <StaticsCardSkeleton />
            </Col>
            <Col className="my-3" md={4} xs={12}>
              <StaticsCardSkeleton />
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <RequestsTableSkeleton />
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <RequestsTableSkeleton />
            </Col>
          </Row>
          
          <Row className="mt-5">
            <Col>
              <RequestsTableSkeleton />
            </Col>
          </Row>
        </Container>
      </DashboardPage>
    );
  }

  if (error) {
    return <div>Error fetching data!</div>; // Handle the error state
  }

  const studentStats = [
    { name: "Total Students", value: dashboard.totalStudents },
    { name: "Verified Students", value: dashboard.verifiedStudents },
    { name: "Pending Verification", value: dashboard.pendingVerification },
    { name: "Canceled Students", value: dashboard.canceledStudents },
    { name: "Enrolled For Test", value: dashboard.centersEnrolled },
  ];

  const teacherStats = [
    { name: "Total Teachers", value: dashboard.totalTeachers },
    { name: "Total Questions", value: dashboard.totalQuestions },
    { name: "Added Questions", value: dashboard.addedQuestions },
    { name: "Remaining Questions", value: dashboard.remainingQuestions },
  ];

  const testCenterStats = [
    { name: "Total Centers", value: dashboard.totalTestCenters },
    { name: "Booked Upcoming", value: dashboard.upcomingTests },
    { name: "Booked Today", value: dashboard.todayTests },
    { name: "Standby", value: dashboard.totalTests - (dashboard.upcomingTests + dashboard.todayTests) },
  ];

  return (
    <DashboardPage>
      <Container fluid>
        <Row>
          <Col>
            <h1 className="mb-5 my-4">Dashboard</h1>
          </Col>
        </Row>
        <Row>
          <Col className="my-3" md={4} xs={12}>
            <ScoreCards heading="Total Tests" number={dashboard.totalTests} />
          </Col>
          <Col className="my-3" md={4} xs={12}>
            <ScoreCards heading="Upcoming Tests" number={dashboard.upcomingTests} />
          </Col>
          <Col className="my-3" md={4} xs={12}>
            <ScoreCards heading="Today's Tests" number={dashboard.todayTests} />
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
            <RequestsTable tablehead="Students Request List" requests={dashboard.studentRequests} />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <RequestsTable tablehead="Paper Request List" requests={dashboard.paperRequests} />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <RequestsTable tablehead="Result Submission Request List" requests={dashboard.resultRequests} />
          </Col>
        </Row>
      </Container>
    </DashboardPage>
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
