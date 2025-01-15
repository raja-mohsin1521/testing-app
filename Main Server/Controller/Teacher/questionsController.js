const pool = require("../../db_Connection/db");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../jwt"); 

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
const getAllCourses = async (req, res) => {
  try {
    
    const result = await pool.query(`SELECT * FROM courses`);

    res.status(200).json( result.rows );
   
  } catch (err) {
    res.status(500).send(err);
  }
};
const getModulesForCourse = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).send("Course ID is required");
  }

  try {
    const result = await pool.query(`SELECT * FROM modules WHERE course_id = $1`, [courseId]);

    if (result.rows.length === 0) {
      return res.status(404).send("No modules found for the given course ID");
    }

    res.status(200).json({ modules: result.rows });
  } catch (err) {
    res.status(500).send("Error fetching modules for the course");
  }
};
const getModuleDetailsByModuleId = async (req, res) => {
  const { moduleId } = req.params;
console.log('first',  req.params)
  if (!moduleId) {
    return res.status(400).send("Module ID is required");
  }

  try {
    
    const result = await pool.query(
      `SELECT 
         modules.module_name, 
         courses.course_name 
       FROM 
         modules 
       INNER JOIN 
         courses 
       ON 
         modules.course_id = courses.id
       WHERE 
         modules.id = $1`,
      [moduleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No details found for the given module ID");
    }

    
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching module and course details");
  }
};
const importObj = async (req, res) => {
  const { data, teacher_id:token  } = req.body;

  let skippedCount = 0;
  let addedCount = 0;
  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    
    const decoded = verifyToken(token);  
    const teacher_id = decoded.teacher_id; 

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }
  
    for (const question of data) {
      const {
        Question_Text,
        Option_1,
        Option_2,
        Option_3,
        Option_4,
        Correct_Answer,
        Difficulty_Level,
        Course,
        Module,
      } = question;

      const checkQuery = `
        SELECT COUNT(*) FROM obj_question WHERE question_text = $1
      `;
      const checkValues = [Question_Text];

      const result = await pool.query(checkQuery, checkValues);
      const count = result.rows[0].count;

      if (count > 0) {
        skippedCount++;
        continue;
      }

      const query = `
        INSERT INTO obj_question (
          question_text, 
          correct_answer, 
          option_1, 
          option_2, 
          option_3, 
          option_4, 
          difficulty_level, 
          teacher_id, 
          course_id, 
          module_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      const values = [
        Question_Text,
        Correct_Answer,
        Option_1,
        Option_2,
        Option_3,
        Option_4,
        Difficulty_Level,
        teacher_id,
        Course,
        Module,
      ];

      await pool.query(query, values);
      addedCount++;
    }

    
    

    return res
      .status(200)
      .json({ message: "Objective questions imported successfully", skippedCount, addedCount });
  } catch (error) {
    console.error("Error importing objective questions:", error);
    return res
      .status(500)
      .json({ message: "Error importing objective questions", error });
  }
};
const importSub = async (req, res) => {
  const { data, teacher_id:token } = req.body;

  let skippedCount = 0;
  let addedCount = 0;

  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    
    const decoded = verifyToken(token);  
    const teacher_id = decoded.teacher_id; 

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }
    for (const question of data) {
      const {
        Question_Text,
        Marks,
        Notes,
        Course,
        Module,
        Difficulty_Level,
      } = question;

      const checkQuery = `
        SELECT COUNT(*) FROM subjective_questions WHERE question_text = $1
      `;
      const checkValues = [Question_Text];

      const result = await pool.query(checkQuery, checkValues);
      const count = result.rows[0].count;

      if (count > 0) {
        skippedCount++;
        continue;
      }

      const query = `
        INSERT INTO subjective_questions (
          question_text, 
          difficulty_level, 
          teacher_id, 
          course_id, 
          module_id, 
          notes, 
          marks
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const values = [
        Question_Text,
        Difficulty_Level,
        teacher_id,
        Course,
        Module,
        Notes,
        Marks,
      ];

      await pool.query(query, values);
      addedCount++;
    }

    
    

    return res
      .status(200)
      .json({ message: "Subjective questions imported successfully", skippedCount, addedCount });
  } catch (error) {
    console.error("Error importing subjective questions:", error);
    return res
      .status(500)
      .json({ message: "Error importing subjective questions", error });
  }
};
const addObjQuestion = async (req, res) => {

  

  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'options[0][image]', maxCount: 1 },
    { name: 'options[1][image]', maxCount: 1 },
    { name: 'options[2][image]', maxCount: 1 },
    { name: 'options[3][image]', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(500).send("Error uploading files.");
    }
console.log('req.file', req.file)
console.log('req.file', req.body)
    const {
      questionText,
      correctAnswer,
      difficultyLevel,
      course_id,
      module_id,
      options,
      token,
    } = req.body;

    try {
      
      
        const decoded = verifyToken(token);  
        const teacher_id = decoded.teacher_id; 
    
        if (!teacher_id) {
          return res.status(400).send("Teacher ID is required.");
        }
     
      const checkQuery = `
        SELECT COUNT(*) FROM obj_question WHERE question_text = $1
      `;
      const checkValues = [questionText];
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rows[0].count > 0) {
        return res.status(400).send("Question already exists in the database.");
      }

      const uploadedImageUrl = req.files?.image?.[0]?.path || null;

      const optionImages = [];
      for (let i = 0; i < 4; i++) {
        const field = `options[${i}][image]`;
        if (req.files[field]) {
          optionImages.push(req.files[field][0].path);
        } else {
          optionImages.push(null);
        }
      }

      const preparedOptions = options.map((option, index) => ({
        text: option?.text || null,
        image: optionImages[index] || null,
      }));

      const result = await pool.query(
        `INSERT INTO obj_question (
          teacher_id, 
          question_text, 
          correct_answer, 
          option_1, 
          option_1_image, 
          option_2, 
          option_2_image, 
          option_3, 
          option_3_image, 
          option_4, 
          option_4_image, 
          difficulty_level, 
          course_id, 
          module_id, 
          image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [
          teacher_id,
          questionText,
          correctAnswer,
          preparedOptions[0]?.text,
          preparedOptions[0]?.image,
          preparedOptions[1]?.text,
          preparedOptions[1]?.image,
          preparedOptions[2]?.text,
          preparedOptions[2]?.image,
          preparedOptions[3]?.text,
          preparedOptions[3]?.image,
          difficultyLevel,
          course_id || null,
          module_id || null,
          uploadedImageUrl,
        ]
      );

      res.status(201).send("Question added successfully");
    } catch (err) {
      console.error("Error adding question:", err);
      res.status(500).send("Error adding question");
    }
  });
};
const addSubjectiveQuestion = async (req, res) => {
  upload.fields([{ name: 'image', maxCount: 1 }])(req, res, async (err) => {
    if (err) {
      return res.status(500).send("Error uploading files.");
    }

    const {
      token,
      questionText,
      notes,
      difficultyLevel,
      marks,
      module_id,
      course_id,
    } = req.body;

    try {


      const decoded = verifyToken(token);  
        const teacher_id = decoded.teacher_id; 
    
        if (!teacher_id) {
          return res.status(400).send("Teacher ID is required.");
        }
      const uploadedImageUrl = req.files?.image?.[0]?.path || null;

      
      const checkQuery = `
        SELECT COUNT(*) FROM subjective_questions WHERE question_text = $1
      `;
      const checkValues = [questionText];
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rows[0].count > 0) {
        return res.status(400).send("Question already exists in the database.");
      }

      
      const result = await pool.query(
        `INSERT INTO subjective_questions (
          teacher_id,
          question_text,
          notes,
          difficulty_level,
          marks,
          module_id,
          course_id,
          image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          teacher_id,
          questionText,
          notes,
          difficultyLevel,
          marks,
          module_id,
          course_id,
          uploadedImageUrl,
        ]
      );

      res.status(201).send("Question added successfully");
    } catch (err) {
      console.error("Error adding subjective question:", err);
      res.status(500).send("Error adding question");
    }
  });
};
const getObjectiveQuestionsWithoutImages = async (req, res) => {
  console.log('req.body', req.body)
  const { teacher_id: token, currentpage: page, course, module, difficulty, sortBy, sortOrder } = req.body;

  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    // Verify token and get teacher_id
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    // Pagination
    const limit = 25;
    const offset = (page - 1) * limit;

    // Base query
    let query = `
      SELECT 
        obj_question_id, 
        teacher_id, 
        question_text, 
        correct_answer, 
        option_1, 
        option_2, 
        option_3, 
        option_4, 
        difficulty_level, 
        obj_question.course_id, 
        obj_question.module_id,
        courses.course_name AS course_name, 
        modules.module_name AS module_name
      FROM obj_question 
      JOIN courses ON obj_question.course_id = courses.id
      JOIN modules ON obj_question.module_id = modules.id
      WHERE teacher_id = $1 AND (image_url IS NULL OR image_url = '')
    `;

    // Filter conditions
    const filterParams = [teacher_id];
    let paramIndex = 2;

    if (course) {
      query += ` AND obj_question.course_id = $${paramIndex}`;
      filterParams.push(course);
      paramIndex++;
    }

    if (module) {
      query += ` AND obj_question.module_id = $${paramIndex}`;
      filterParams.push(module);
      paramIndex++;
    }

    if (difficulty) {
      query += ` AND difficulty_level = $${paramIndex}`;
      filterParams.push(difficulty);
      paramIndex++;
    }

    // Sorting
    if (sortBy && sortOrder) {
      const validSortColumns = ["question_text", "difficulty_level", "course_name", "module_name"];
      const validSortOrders = ["asc", "desc"];

      if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder)) {
        query += ` ORDER BY ${sortBy} ${sortOrder}`;
      }
    }

    // Pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    filterParams.push(limit, offset);

    // Execute the query
    const result = await pool.query(query, filterParams);

    // Total count query
    let totalCountQuery = `
      SELECT COUNT(*) AS total 
      FROM obj_question 
      JOIN courses ON obj_question.course_id = courses.id
      JOIN modules ON obj_question.module_id = modules.id
      WHERE teacher_id = $1 AND (image_url IS NULL OR image_url = '')
    `;

    const totalCountParams = [teacher_id];
    let totalParamIndex = 2;

    if (course) {
      totalCountQuery += ` AND obj_question.course_id = $${totalParamIndex}`;
      totalCountParams.push(course);
      totalParamIndex++;
    }

    if (module) {
      totalCountQuery += ` AND obj_question.module_id = $${totalParamIndex}`;
      totalCountParams.push(module);
      totalParamIndex++;
    }

    if (difficulty) {
      totalCountQuery += ` AND difficulty_level = $${totalParamIndex}`;
      totalCountParams.push(difficulty);
      totalParamIndex++;
    }

    const totalCountResult = await pool.query(totalCountQuery, totalCountParams);
    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No objective questions found for this teacher.");
    }

    res.json({
      objective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching objective questions without images:", err);
    res.status(500).send("Error fetching objective questions without images");
  }
};
const getSubjectiveQuestionsWithoutImages = async (req, res) => {
  const { teacher_id: token, currentpage: page, course, module, difficulty, sortBy, sortOrder } = req.body;

  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const limit = 25;
    const offset = (page - 1) * limit;

    // Base query
    let query = `
      SELECT 
        subj_question_id, 
        teacher_id, 
        question_text, 
        difficulty_level, 
        subjective_questions.course_id, 
        subjective_questions.module_id,
        courses.course_name AS course_name, 
        modules.module_name AS module_name,
        notes,
        marks
      FROM subjective_questions 
      JOIN courses ON subjective_questions.course_id = courses.id
      JOIN modules ON subjective_questions.module_id = modules.id
      WHERE teacher_id = $1 AND image_url IS NULL
    `;

    // Filter conditions
    const filterParams = [teacher_id];
    let paramIndex = 2;

    if (course) {
      query += ` AND subjective_questions.course_id = $${paramIndex}`;
      filterParams.push(course);
      paramIndex++;
    }

    if (module) {
      query += ` AND subjective_questions.module_id = $${paramIndex}`;
      filterParams.push(module);
      paramIndex++;
    }

    if (difficulty) {
      query += ` AND difficulty_level = $${paramIndex}`;
      filterParams.push(difficulty);
      paramIndex++;
    }

    // Sorting
    if (sortBy && sortOrder) {
      const validSortColumns = ["question_text", "difficulty_level", "course_name", "module_name"];
      const validSortOrders = ["asc", "desc"];

      if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder)) {
        query += ` ORDER BY ${sortBy} ${sortOrder}`;
      }
    }

    // Pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    filterParams.push(limit, offset);

    // Execute the query
    const result = await pool.query(query, filterParams);

    // Total count query
    let totalCountQuery = `
      SELECT COUNT(*) AS total 
      FROM subjective_questions 
      JOIN courses ON subjective_questions.course_id = courses.id
      JOIN modules ON subjective_questions.module_id = modules.id
      WHERE teacher_id = $1 AND image_url IS NULL
    `;

    const totalCountParams = [teacher_id];
    let totalParamIndex = 2;

    if (course) {
      totalCountQuery += ` AND subjective_questions.course_id = $${totalParamIndex}`;
      totalCountParams.push(course);
      totalParamIndex++;
    }

    if (module) {
      totalCountQuery += ` AND subjective_questions.module_id = $${totalParamIndex}`;
      totalCountParams.push(module);
      totalParamIndex++;
    }

    if (difficulty) {
      totalCountQuery += ` AND difficulty_level = $${totalParamIndex}`;
      totalCountParams.push(difficulty);
      totalParamIndex++;
    }

    const totalCountResult = await pool.query(totalCountQuery, totalCountParams);
    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No subjective questions found for this teacher.");
    }

    res.json({
      subjective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching subjective questions without images:", err);
    res.status(500).send("Error fetching subjective questions without images");
  }
};
const getObjectiveQuestionsWithImages = async (req, res) => {
  const { teacher_id: token, page, course, difficulty, sortBy, sortOrder } = req.body;

  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const limit = 4;
    const offset = (page - 1) * limit;

    // Base query
    let query = `
      SELECT 
        obj_question.obj_question_id, 
        obj_question.teacher_id, 
        obj_question.question_text, 
        obj_question.correct_answer, 
        obj_question.option_1, 
        obj_question.option_2, 
        obj_question.option_3, 
        obj_question.option_4, 
        obj_question.difficulty_level, 
        obj_question.course_id, 
        obj_question.module_id,
        obj_question.image_url, 
        obj_question.option_1_image, 
        obj_question.option_2_image, 
        obj_question.option_3_image, 
        obj_question.option_4_image,
        courses.course_name AS course_name, 
        modules.module_name AS module_name
      FROM obj_question 
      JOIN courses ON obj_question.course_id = courses.id
      JOIN modules ON obj_question.module_id = modules.id
      WHERE obj_question.teacher_id = $1 
        AND (obj_question.image_url IS NOT NULL AND obj_question.image_url != '')
    `;

    // Add filters
    const queryParams = [teacher_id];
    if (course) {
      query += ` AND courses.course_name = $${queryParams.length + 1}`;
      queryParams.push(course);
    }
    if (difficulty) {
      query += ` AND obj_question.difficulty_level = $${queryParams.length + 1}`;
      queryParams.push(difficulty);
    }

    // Add sorting
    if (sortBy && sortOrder) {
      const validSortColumns = ["question_text", "difficulty_level", "course_name", "module_name"];
      const validSortOrders = ["asc", "desc"];

      if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder)) {
        query += ` ORDER BY ${sortBy} ${sortOrder}`;
      }
    }

    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    // Execute the query
    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) AS total 
      FROM obj_question 
      JOIN courses ON obj_question.course_id = courses.id
      JOIN modules ON obj_question.module_id = modules.id
      WHERE obj_question.teacher_id = $1 
        AND (obj_question.image_url IS NOT NULL AND obj_question.image_url != '')
    `;

    const countParams = [teacher_id];
    if (course) {
      countQuery += ` AND courses.course_name = $${countParams.length + 1}`;
      countParams.push(course);
    }
    if (difficulty) {
      countQuery += ` AND obj_question.difficulty_level = $${countParams.length + 1}`;
      countParams.push(difficulty);
    }

    const totalCountResult = await pool.query(countQuery, countParams);
    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No objective questions with images found for this teacher.");
    }

    res.json({
      objective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching objective questions with images:", err);
    res.status(500).send("Error fetching objective questions with images");
  }
};
const getSubjectiveQuestionsWithImages = async (req, res) => {
  const { teacher_id: token, page, course, difficulty, sortBy, sortOrder } = req.body;

  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;

    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

    const limit = 10;
    const offset = (page - 1) * limit;

    // Base query
    let query = `
      SELECT 
        subjective_questions.subj_question_id, 
        subjective_questions.teacher_id, 
        subjective_questions.question_text, 
        subjective_questions.difficulty_level, 
        subjective_questions.notes, 
        subjective_questions.image_url, 
        subjective_questions.marks,
        subjective_questions.course_id, 
        subjective_questions.module_id,
        courses.course_name AS course_name, 
        modules.module_name AS module_name
      FROM subjective_questions
      JOIN courses ON subjective_questions.course_id = courses.id
      JOIN modules ON subjective_questions.module_id = modules.id
      WHERE subjective_questions.teacher_id = $1 
        AND (subjective_questions.image_url IS NOT NULL AND subjective_questions.image_url != '')
    `;

    // Add filters
    const queryParams = [teacher_id];
    if (course) {
      query += ` AND courses.course_name = $${queryParams.length + 1}`;
      queryParams.push(course);
    }
    if (difficulty) {
      query += ` AND subjective_questions.difficulty_level = $${queryParams.length + 1}`;
      queryParams.push(difficulty);
    }

    // Add sorting
    if (sortBy && sortOrder) {
      const validSortColumns = ["question_text", "difficulty_level", "course_name", "module_name", "marks"];
      const validSortOrders = ["asc", "desc"];

      if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder)) {
        query += ` ORDER BY ${sortBy} ${sortOrder}`;
      }
    }

    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    // Execute the query
    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) AS total 
      FROM subjective_questions
      JOIN courses ON subjective_questions.course_id = courses.id
      JOIN modules ON subjective_questions.module_id = modules.id
      WHERE subjective_questions.teacher_id = $1 
        AND (subjective_questions.image_url IS NOT NULL AND subjective_questions.image_url != '')
    `;

    const countParams = [teacher_id];
    if (course) {
      countQuery += ` AND courses.course_name = $${countParams.length + 1}`;
      countParams.push(course);
    }
    if (difficulty) {
      countQuery += ` AND subjective_questions.difficulty_level = $${countParams.length + 1}`;
      countParams.push(difficulty);
    }

    const totalCountResult = await pool.query(countQuery, countParams);
    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No subjective questions with images found for this teacher.");
    }

    res.json({
      subjective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching subjective questions with images:", err);
    res.status(500).send("Error fetching subjective questions with images");
  }
};
const editObjQuestion = async (req, res) => {
  const {
    token,
    question_id:questionId,
    question_text:questionText,
    correct_answer:correctAnswer,
    difficulty_level:difficultyLevel,
    course_id,
    module_id,
    option_1,
    option_2,
    option_3,
    option_4,
  } = req.body.updatedData;
console.log('first', req.body.updatedData)
  try {
    
    if (!course_id || !module_id) {
      return res.status(400).send("course_id and module_id are required and cannot be null.");
    }

    
  

    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;
    if (!teacher_id) return res.status(400).send("Teacher ID is required.");

    
    const query = `
      UPDATE obj_question 
      SET question_text = $1, 
          correct_answer = $2, 
          option_1 = $3, 
          option_2 = $4, 
          option_3 = $5, 
          option_4 = $6, 
          difficulty_level = $7, 
          course_id = $8, 
          module_id = $9 
      WHERE obj_question_id = $10 AND teacher_id = $11
    `;

    const queryParams = [
      questionText,
      correctAnswer,
      option_1,
      option_2,
      option_3,
      option_4,
      difficultyLevel,
      course_id,
      module_id,
      questionId,
      teacher_id,
    ];

    
    console.log("Final Query:", query);
    console.log("Query Parameters:", queryParams);

    
    const s=await pool.query(query, queryParams);
console.log('first', s.rows)
    res.status(200).send("Question updated successfully");
  } catch (err) {
    console.error("Error updating objective question:", err);
    res.status(500).send("Error updating question");
  }
};
const editSubjQuestion = async (req, res) => {
  const {
    token,
    question_id: questionId,
    question_text: questionText,
    notes,
    difficulty_level: difficultyLevel,
    marks,
    course_id,
    module_id,
  } = req.body.updatedData;

  console.log('first', req.body.updatedData);

  try {
    // Validate required fields
    if (!course_id || !module_id) {
      return res.status(400).send("course_id and module_id are required and cannot be null.");
    }

    // Verify token and get teacher_id
    const decoded = verifyToken(token);
    const teacher_id = decoded.teacher_id;
    if (!teacher_id) return res.status(400).send("Teacher ID is required.");

    // Construct the SQL query
    const query = `
      UPDATE subjective_questions 
      SET question_text = $1, 
          notes = $2, 
          difficulty_level = $3, 
          marks = $4, 
          course_id = $5, 
          module_id = $6 
      WHERE subj_question_id = $7 AND teacher_id = $8
    `;

    // Prepare query parameters
    const queryParams = [
      questionText,
      notes,
      difficultyLevel,
      marks,
      course_id,
      module_id,
      questionId,
      teacher_id,
    ];

    // Debugging: Log the final query and parameters
    console.log("Final Query:", query);
    console.log("Query Parameters:", queryParams);

    // Execute the query
    const result = await pool.query(query, queryParams);
    console.log('Query Result:', result.rows);

    res.status(200).send("Question updated successfully");
  } catch (err) {
    console.error("Error updating subjective question:", err);
    res.status(500).send("Error updating question");
  }
};
const deleteQuestion = async (req, res) => {
  const { id:question_id, teacher_id:token, type } = req.body;

  console.log('req.body', req.body)

  const tableName = type === "sub" ? "subjective_questions" : type === "obj" ? "obj_question" : null;

  if (!tableName) {
    return res.status(400).send("Invalid type. Must be 'sub' or 'obj'.");
  }



  if (!token) {
    return res.status(400).send("Token is required.");
  }

  try {
    
    const decoded = verifyToken(token);  
    const teacher_id = decoded.teacher_id; 
console.log('first', teacher_id)
    if (!teacher_id) {
      return res.status(400).send("Teacher ID is required.");
    }

  
    

    const result = await pool.query(
      `DELETE FROM ${tableName} 
        WHERE ${tableName === "subjective_questions" ? "subj_question_id" : "obj_question_id"} = $1 
          AND teacher_id = $2
        RETURNING *`,
      [question_id, teacher_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Question not found or you're not authorized to delete this question.");
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).send("Error deleting question");
  }
};

module.exports = {
  addObjQuestion,
  addSubjectiveQuestion,
  editObjQuestion,
  editSubjQuestion,
  getObjectiveQuestionsWithoutImages,
  getSubjectiveQuestionsWithoutImages,
  getObjectiveQuestionsWithImages,
  getSubjectiveQuestionsWithImages,
  deleteQuestion,
  importSub,
  importObj,
  getAllCourses,
  getModulesForCourse,
  getModuleDetailsByModuleId
};

