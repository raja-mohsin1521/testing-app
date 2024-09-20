const pool = require("../../db_Connection/db");

// Function to get all tests
const getAllTests = async (req, res) => {
  try {
    const result = await pool.query('SELECT test_id, test_name FROM test');
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Function to get all cities
const getAllCities = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT city FROM test_center');
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Function to get all centers
const getAllCenters = async (req, res) => {
    try {
      const { date, time } = req.body;
      console.log('req.body', req.body);
  
      if (!date || !time) {
        return res.status(400).json({
          success: false,
          message: 'Date and time are required',
        });
      }
  
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + 6 * 60 * 60 * 1000); // 6 hours later
  
      // Format start and end date-times for SQL query
      const startDateISO = startDateTime.toISOString();
      const endDateISO = endDateTime.toISOString();
  
      // Extract date part for filtering
      const startDateISODate = startDateISO.split('T')[0]; // Only date part
      const startTimeISO = startDateISO.split('T')[1]; // Only time part
  
      const result = await pool.query(`
        SELECT tc.test_center_id, tc.capacity, tc.city, tc.institute_name
        FROM test_center tc
        WHERE NOT EXISTS (
          SELECT 1
          FROM scheduled_test st
          WHERE tc.test_center_id = st.test_center_id
            AND st.test_date = $1
            AND st.test_time >= $2
            AND st.test_time < $3
        )
      `, [startDateISODate, startTimeISO, endDateISO.split('T')[1]]);
  
      const uniqueCenters = [];
      const seen = new Set();
  
      for (const center of result.rows) {
        if (!seen.has(center.test_center_id)) {
          seen.add(center.test_center_id);
          uniqueCenters.push(center);
        }
      }
  
      return res.status(200).json({
        success: true,
        data: uniqueCenters,
      });
    } catch (error) {
      console.error('Error fetching centers:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  


const getSpecificCenters = async (req, res) => {
  try {
    const { city, date, time } = req.body;
console.log('req.body', req.body)
    if (!city || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'City, date, and time are required',
      });
    }

    const startDateTime = new Date(`${date}T${time}`);
    const startDateISO = startDateTime.toISOString().split('T')[0]; 

    const cities = Array.isArray(city) ? city : [city];
    const placeholders = cities.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      SELECT tc.test_center_id, tc.institute_name, tc.capacity
      FROM test_center tc
      WHERE tc.city IN (${placeholders})
        AND NOT EXISTS (
          SELECT 1
          FROM scheduled_test st
          WHERE st.test_center_id = tc.test_center_id
            AND st.test_date = $${cities.length + 1}
            AND st.test_time BETWEEN '00:00:00' AND '23:59:59'
        )
      GROUP BY tc.test_center_id, tc.institute_name, tc.capacity
    `;

    const result = await pool.query(query, [...cities, startDateISO]);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching specific centers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Function to add scheduled tests
const addScheduledTest = async (req, res) => {
  const {
    selectedTest: test_id,
    selectedCenters,
    regStartDate: registration_start_date,
    regEndDate: registration_end_date,
    testDate: test_date,
    testTime: test_time,
  } = req.body;

  if (!test_id || !selectedCenters || !Array.isArray(selectedCenters) || selectedCenters.length === 0 || !registration_start_date || !registration_end_date || !test_date || !test_time) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required and centers must be provided',
    });
  }

  try {
    const insertQueries = selectedCenters.map(center_id => {
      return pool.query(
        `INSERT INTO scheduled_test (test_id, test_center_id, registration_start_date, registration_end_date, test_date, test_time) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [test_id, center_id, registration_start_date, registration_end_date, test_date, test_time]
      );
    });

    const results = await Promise.all(insertQueries);

    return res.status(201).json({
      success: true,
      message: 'Scheduled tests added successfully',
      data: results.map(result => result.rows[0]),
    });
  } catch (error) {
    console.error('Error adding scheduled tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Function to get schedule test details
const getScheduleTestDetails = async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Current date in ISO format
  
      // Query to get test details including center IDs
      const result = await pool.query(
        `SELECT 
           t.test_id AS "testId", 
           t.test_name AS "testName", 
           st.test_date::date AS "testDate", -- Exclude time part
           TO_CHAR(st.test_time, 'HH24:MI') AS "testTime", -- Exclude seconds
           COUNT(DISTINCT tc.test_center_id) AS "totalCenters", 
           SUM(tc.capacity) AS "totalCapacity", -- Total capacity of all test centers
           COUNT(tr.student_id) AS "registeredStudents", -- Total number of registered students for that test
           ARRAY_AGG(DISTINCT tc.test_center_id) AS "centerIds" -- Aggregate center IDs
         FROM scheduled_test st
         JOIN test t ON st.test_id = t.test_id
         JOIN test_center tc ON st.test_center_id = tc.test_center_id
         LEFT JOIN test_registration tr ON st.scheduled_test_id = tr.scheduled_test_id
         WHERE st.test_date >= $1
         GROUP BY t.test_id, t.test_name, st.test_date, st.test_time
         ORDER BY st.test_date, st.test_time`, [today]
      );
  
      if (result.rows.length > 0) {
        return res.status(200).json({
          success: true,
          data: result.rows,
        });
      } else {
        return res.status(204).json({
          success: true,
          message: 'No upcoming tests found',
        });
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  
  

// Function to get detailed test information
const getDetailedTestInfo = async (req, res) => {
    try {
        const { testId, testDate, testTime, centerIds } = req.body;

        if (!testId || !testDate || !testTime) {
            return res.status(400).json({
                success: false,
                message: 'Test ID, date, and time are required',
            });
        }

        const formattedDate = new Date(testDate).toISOString().split('T')[0];

        // Query - Get Test Information
        const testInfoResult = await pool.query(
            `SELECT 
               t.test_id AS "testId", 
               t.test_name AS "testName", 
               t.subject AS "subject", 
               t.eligibility_criteria AS "eligibilityCriteria", 
               t.difficulty_level AS "difficultyLevel"
             FROM test t
             WHERE t.test_id = $1`,
            [testId]
        );

        if (testInfoResult.rows.length === 0) {
            return res.status(204).json({
                success: true,
                message: 'No test details found',
            });
        }

        const testData = testInfoResult.rows[0];

        // Query - Get Test Centers based on centerIds
        const centerQuery = `
            SELECT 
              tc.test_center_id AS "centerId", 
              tc.institute_name AS "centerName", 
              tc.address AS "centerAddress", 
              tc.city AS "centerCity", 
              tc.capacity AS "centerCapacity"
            FROM test_center tc
            WHERE tc.test_center_id = ANY($1::int[])`;

        const centerResult = await pool.query(centerQuery, [centerIds]);

        const centers = centerResult.rows;

        // Query - Get Scheduled Test Dates and Times
        const scheduleQuery = `
            SELECT 
              st.registration_start_date AS "registrationStartDate",
              st.registration_end_date AS "registrationEndDate",
              st.test_date AS "testDate", 
              st.test_time AS "testTime"
            FROM scheduled_test st
            WHERE st.test_id = $1
             `;

        const scheduleResult = await pool.query(scheduleQuery, [testId]);

        const scheduledTests = scheduleResult.rows;

        // Query - Get Registered Students
        const registrationResult = await pool.query(
            `SELECT 
               tc.test_center_id AS "centerId",
               ARRAY_AGG(s.full_name) AS "studentNames", 
               ARRAY_AGG(s.email) AS "studentEmails", 
               ARRAY_AGG(s.phone_cnic) AS "studentCNICs"
             FROM test_registration tr
             JOIN student s ON tr.student_id = s.student_id
             JOIN scheduled_test st ON tr.scheduled_test_id = st.scheduled_test_id
             JOIN test_center tc ON st.test_center_id = tc.test_center_id
             WHERE st.test_id = $1
               AND st.test_date = $2
               AND st.test_time = $3
             GROUP BY tc.test_center_id`,
            [testId, formattedDate, testTime]
        );

        const registeredStudents = registrationResult.rows;

        // Format the response data
        const formattedData = {
            commonDetails: {
                registrationStartDate: scheduledTests.length ? scheduledTests[0].registrationStartDate : 'No data',
                registrationEndDate: scheduledTests.length ? scheduledTests[0].registrationEndDate : 'No data',
                testDate: formattedDate,
                testTime: testTime,
                testName: testData.testName,
                testId: testData.testId,
                subject: testData.subject,
                eligibilityCriteria: testData.eligibilityCriteria,
                difficultyLevel: testData.difficultyLevel,
            },
            centers: centers.map(center => {
                const studentData = registeredStudents.find(student => student.centerId === center.centerId) || {};
                return {
                    centerName: center.centerName,
                    centerAddress: center.centerAddress,
                    centerCity: center.centerCity,
                    centerCapacity: center.centerCapacity,
                    totalRegisteredStudents: studentData.studentNames ? studentData.studentNames.length : 0,
                    centerId: center.centerId,
                    studentNames: studentData.studentNames || [],
                    studentEmails: studentData.studentEmails || [],
                    studentCNICs: studentData.studentCNICs || [],
                };
            }),
        };

        // Return the formatted data
        return res.status(200).json({
            success: true,
            data: formattedData,
        });

    } catch (error) {
        console.error('Error fetching detailed test information:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};




  
  
  

module.exports = {
  getAllTests,
  getAllCities,
  getAllCenters,
  getSpecificCenters,
  addScheduledTest,
  getScheduleTestDetails,
  getDetailedTestInfo
};
