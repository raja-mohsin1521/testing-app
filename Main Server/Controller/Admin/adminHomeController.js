const pool = require("../../db_Connection/db");

const getStatistics = async (req, res) => {
  try {
    const totalTestsResult = await pool.query("SELECT COUNT(*) AS total_tests FROM test");
    const totalTests = parseInt(totalTestsResult.rows[0].total_tests);

    const todayTestsResult = await pool.query(`
      SELECT COUNT(*) AS booked_today
      FROM test_registration
      JOIN scheduled_test ON test_registration.scheduled_test_id = scheduled_test.scheduled_test_id
      WHERE DATE(scheduled_test.test_date_time) = CURRENT_DATE
    `);
    const todayTests = parseInt(todayTestsResult.rows[0].booked_today);

    const upcomingTestsResult = await pool.query(`
      SELECT COUNT(*) AS booked_upcoming
      FROM test_registration
      JOIN scheduled_test ON test_registration.scheduled_test_id = scheduled_test.scheduled_test_id
      WHERE scheduled_test.test_date_time > CURRENT_TIMESTAMP
    `);
    const upcomingTests = parseInt(upcomingTestsResult.rows[0].booked_upcoming);

    const totalStudentsResult = await pool.query("SELECT COUNT(*) AS total_students FROM student");
    const totalStudents = parseInt(totalStudentsResult.rows[0].total_students);

    const verifiedStudentsResult = await pool.query(`
      SELECT COUNT(*) AS verified_students
      FROM student_verification
      WHERE verification_status = 'Approved'
    `);
    const verifiedStudents = parseInt(verifiedStudentsResult.rows[0].verified_students);

    const pendingVerificationResult = await pool.query(`
      SELECT COUNT(*) AS pending_verifications
      FROM student_verification
      WHERE verification_status = 'Pending'
    `);
    const pendingVerification = parseInt(pendingVerificationResult.rows[0].pending_verifications);

    const canceledStudentsResult = await pool.query(`
      SELECT COUNT(*) AS canceled_students
      FROM student_verification
      WHERE verification_status = 'Canceled'
    `);
    const canceledStudents = parseInt(canceledStudentsResult.rows[0].canceled_students);

    const totalTestCentersResult = await pool.query("SELECT COUNT(*) AS total_centers FROM test_center");
    const totalTestCenters = parseInt(totalTestCentersResult.rows[0].total_centers);

    const centersEnrolledResult = await pool.query(`
      SELECT COUNT(DISTINCT test_center_id) AS count
      FROM scheduled_test
    `);
    const centersEnrolled = parseInt(centersEnrolledResult.rows[0].count);

    const totalTeachersResult = await pool.query("SELECT COUNT(*) AS total_teachers FROM teacher");
    const totalTeachers = parseInt(totalTeachersResult.rows[0].total_teachers);

    const totalQuestionsResult = await pool.query("SELECT COUNT(*) AS total_questions FROM question");
    const totalQuestions = parseInt(totalQuestionsResult.rows[0].total_questions);

    const addedQuestionsResult = await pool.query("SELECT COUNT(*) AS added_questions FROM question WHERE difficulty_level IS NOT NULL");
    const addedQuestions = parseInt(addedQuestionsResult.rows[0].added_questions);

    const remainingQuestionsResult = await pool.query(`
      SELECT COUNT(*) AS remaining_questions
      FROM question
      WHERE difficulty_level IS NULL
    `);
    const remainingQuestions = parseInt(remainingQuestionsResult.rows[0].remaining_questions);

    const studentRequestsResult = await pool.query(`
      SELECT request_id AS number, test_name, institute_name AS test_center, subject, request_date_time AS date
      FROM request
      JOIN test ON request.test_id = test.test_id
      JOIN test_center ON request.test_center_id = test_center.test_center_id
      WHERE request_type = 'student'
    `);
    const studentRequests = studentRequestsResult.rows;

    const paperRequestsResult = await pool.query(`
      SELECT request_id AS number, test_name, institute_name AS test_center, subject, request_date_time AS date
      FROM request
      JOIN test ON request.test_id = test.test_id
      JOIN test_center ON request.test_center_id = test_center.test_center_id
      WHERE request_type = 'paper'
    `);
    const paperRequests = paperRequestsResult.rows;

    const resultRequestsResult = await pool.query(`
      SELECT request_id AS number, test_name, institute_name AS test_center, subject, request_date_time AS date
      FROM request
      JOIN test ON request.test_id = test.test_id
      JOIN test_center ON request.test_center_id = test_center.test_center_id
      WHERE request_type = 'result'
    `);
    const resultRequests = resultRequestsResult.rows;

    res.json({
      totalTests,
      todayTests,
      upcomingTests,
      totalStudents,
      verifiedStudents,
      pendingVerification,
      canceledStudents,
      totalTestCenters,
      centersEnrolled,
      totalTeachers,
      totalQuestions,
      addedQuestions,
      remainingQuestions,
      studentRequests,
      paperRequests,
      resultRequests
    });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStatistics };
