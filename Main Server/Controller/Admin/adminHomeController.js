const pool = require("../../db_Connection/db");

const getStatistics = async (req, res) => {
  try {
    const totalTestsResult = await pool.query("SELECT COUNT(*) FROM SelectedTests");
    const totalTests = parseInt(totalTestsResult.rows[0].count);

    const today = new Date().toISOString().split('T')[0];
    const upcomingTestsResult = await pool.query("SELECT COUNT(*) FROM SelectedTests WHERE TestDate > $1", [today]);
    const upcomingTests = parseInt(upcomingTestsResult.rows[0].count);

    const todayTestsResult = await pool.query("SELECT COUNT(*) FROM SelectedTests WHERE TestDate = $1", [today]);
    const todayTests = parseInt(todayTestsResult.rows[0].count);

    const totalStudentsResult = await pool.query("SELECT COUNT(*) FROM Students");
    const totalStudents = parseInt(totalStudentsResult.rows[0].count);

    const verifiedStudentsResult = await pool.query("SELECT COUNT(*) FROM StudentVerification WHERE VerificationStatus = 'Approved'");
    const verifiedStudents = parseInt(verifiedStudentsResult.rows[0].count);

    const pendingVerificationResult = await pool.query("SELECT COUNT(*) FROM StudentVerification WHERE VerificationStatus = 'Pending'");
    const pendingVerification = parseInt(pendingVerificationResult.rows[0].count);

    const totalTeachersResult = await pool.query("SELECT COUNT(*) FROM Teachers");
    const totalTeachers = parseInt(totalTeachersResult.rows[0].count);

    const totalQuestionsResult = await pool.query("SELECT COUNT(*) FROM Questions");
    const totalQuestions = parseInt(totalQuestionsResult.rows[0].count);

    const totalQuestionsAddedResult = await pool.query("SELECT COUNT(*) FROM Questions WHERE TeacherID IS NOT NULL");
    const totalQuestionsAdded = parseInt(totalQuestionsAddedResult.rows[0].count);

    const remainingQuestions = totalQuestions - totalQuestionsAdded;

    const totalTestCentersResult = await pool.query("SELECT COUNT(*) FROM TestCenters");
    const totalTestCenters = parseInt(totalTestCentersResult.rows[0].count);

    const centersEnrolledResult = await pool.query("SELECT COUNT(DISTINCT TestCenterID) FROM SelectedTests");
    const centersEnrolled = parseInt(centersEnrolledResult.rows[0].count);

    const pendingStudentsResult = await pool.query(
      "SELECT s.Email, sv.CNICFront, sv.CNICBack FROM Students s JOIN StudentVerification sv ON s.StudentID = sv.StudentID WHERE sv.VerificationStatus = 'Pending'"
    );

    const rejectedStudentsResult = await pool.query(
      "SELECT s.Email, sv.CNICFront, sv.CNICBack FROM Students s JOIN StudentVerification sv ON s.StudentID = sv.StudentID WHERE sv.VerificationStatus = 'Canceled'"
    );

    res.json({
      totalTests,
      upcomingTests,
      todayTests,
      totalStudents,
      verifiedStudents,
      pendingVerification,
      totalTeachers,
      totalQuestions,
      totalQuestionsAdded,
      remainingQuestions,
      totalTestCenters,
      centersEnrolled,
      pendingStudents: pendingStudentsResult.rows,
      rejectedStudents: rejectedStudentsResult.rows
    });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStatistics };
