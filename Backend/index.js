const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const JWT = require("jsonwebtoken");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());

const JWT_Pass = "RashiKaKey";

// Signup User
app.post("/user/signup", async (req, res) => {
  const { username, name, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        username,
        name,
        password

      },
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// Signin User
app.post("/user/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = JWT.sign({ username: user.username, id: user.id }, JWT_Pass,);


    res.json({
      message: "Signin successful",
      token,
      user
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Signup Admin
app.post("/admin/signup", async (req, res) => {
  const { username, name, password } = req.body;

  try {
    const admin = await prisma.admin.create({
      data: {
        username,
        name,
        password
      },
    });

    res.json({ message: "Admin created successfully", admin });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// Signin Admin
app.post("/admin/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = JWT.sign({ username: admin.username, id: admin.id }, JWT_Pass,);

    res.json({
      message: "Signin successful",
      token,
      admin
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Dashboard Admin
app.get("/admin/quiz", async (req, res) => {

  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const adminid = decoded.id;

    const quizs = await prisma.quiz.findMany({
      where: { adminId: adminid }
    });
    res.json(quizs);
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});



// Dashboard User
app.get("/user/quiz", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);

    const quizs = await prisma.quiz.findMany({
      where: { hidden: false },
      include: {
        admin: {
          select: {
            name: true
          }
        }
      }
    });

    res.json(quizs);
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});




// Admin get Quiz by id
app.get("/admin/quiz/:id", async (req, res) => {

  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const adminid = decoded.id;
    const quizid = req.params.id;

    const quizs = await prisma.quiz.findFirst({
      where: {
        adminId: adminid,
        id: quizid,
      },
    });
    res.json(quizs);
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});




// user get Quiz by id
app.get("/user/quiz/:id", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const userId = decoded.id;
    const quizid = req.params.id;

    const quiz = await prisma.quiz.findFirst({
      where: {
        hidden: false,
        id: quizid,
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });


    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});


// user get Quiz by code
app.get("/user/quiz/viacode/:code", async (req, res) => {

  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const userid = decoded.userid;
    const quizcode = req.params.code;

    const quizs = await prisma.quiz.findFirst({
      where: { hidden: false, code: quizcode, },
      include: {
        admin: {
          select: {
            name: true
          }
        }
      }
    });
    res.json(quizs);
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});


// Post Quiz

app.post("/admin/quiz", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const adminId = decoded.id;
    const { title, code, questions } = req.body;

    //Sample Quiz {
    //   "title": "Basic Math",
    //    "code":"12345678"
    //     "questions": [
    //       {
    //         "text": "2 + 2 = ?",
    //         "options": [
    //           { "text": "3", "isCorrect": false },
    //           { "text": "4", "isCorrect": true },
    //           { "text": "5", "isCorrect": false }
    //         ]
    //       },
    //       {
    //         "text": "5 x 1 = ?",
    //         "options": [
    //           { "text": "5", "isCorrect": true },
    //           { "text": "1", "isCorrect": false },
    //           { "text": "10", "isCorrect": false }
    //         ]
    //       }
    //     ]
    // }


    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        code,
        adminId,
        questions: {
          create: questions.map((question) => ({
            text: question.text,
            options: {
              create: question.options.map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    res.json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (err) {
    console.error("Quiz creation error:", err);
    res.status(500).json({ message: "Failed to create quiz" });
  }
});


// user post answer
app.post("/user/quiz/:id", async (req, res) => {
  const token = req.headers.token;
  const quizId = req.params.id;

  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const userId = decoded.id;
    const { responses, timeTaken } = req.body; // receive timeTaken from frontend

    // Create responses
    await prisma.response.createMany({
      data: responses.map((r) => ({
        userId,
        questionId: r.questionId,
        selectedOptionId: r.selectedOptionId,
      })),
    });

    // Calculate score
    const optionIds = responses.map((r) => r.selectedOptionId);
    const correctOptions = await prisma.option.findMany({
      where: {
        id: { in: optionIds },
        isCorrect: true,
      },
    });

    const totalAttended = responses.length;
    const totalCorrect = correctOptions.length;

    // Get or create leaderboard
    let leaderboard = await prisma.leaderboard.findUnique({
      where: { quizid: quizId },
    });

    if (!leaderboard) {
      leaderboard = await prisma.leaderboard.create({
        data: {
          quiz: { connect: { id: quizId } },
        },
      });
    }

    // Create leaderboard entry with timeTaken
    await prisma.leaderboardEntry.create({
      data: {
        userId,
        leaderboardId: leaderboard.id,
        score: totalCorrect,
        timeTaken, // 🆕 save time taken
      },
    });

    res.json({
      message: "Responses submitted",
      totalAttended: "Total attended " + totalAttended,
      totalCorrect: "Total Correct " + totalCorrect,
      timeTaken,
    });
  } catch (err) {
    console.error("Response submission error:", err);
    res.status(500).json({ message: "Failed to submit responses" });
  }
});

// Get quiz IDs that the user has already attempted
app.get("/user/attempted", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const userId = decoded.id;


    const responses = await prisma.response.findMany({
      where: { userId },
      include: {
        question: {
          select: {
            quizId: true
          }
        }
      }
    });

    // Extract unique quiz IDs from responses
    const quizIds = Array.from(
      new Set(responses.map((r) => r.question?.quizId).filter(Boolean))
    );

    res.json({ quizIds });
  } catch (err) {
    console.error("Error fetching attempted quizzes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// All Leaderboard 
app.get("/user/results", async (req, res) => {

  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const userid = decoded.id;

    const result = await prisma.leaderboard.findMany();
    res.json(result);
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});


// All Leaderboard for User (filtered by participation)
app.get("/user/participation", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const userId = decoded.userid;

    const entries = await prisma.leaderboardEntry.findMany({
      where: { userId },
      select: {
        leaderboard: {
          select: {
            quiz: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    const participatedQuizzes = entries.map(e => e.leaderboard.quiz);

    // Remove duplicates
    const uniqueQuizzes = Array.from(
      new Map(participatedQuizzes.map(q => [q.id, q])).values()
    );

    res.json(uniqueQuizzes);
  } catch (err) {
    console.error("Error getting user results:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

// All Leaderboard for User by id
app.get("/user/results/:id", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const quizid = req.params.id;

    const leaderboard = await prisma.leaderboard.findFirst({
      where: { quizid },
      include: {
        entries: {
          include: {
            user: {
              select: {
                name: true,
                username: true
              }
            }
          },
          orderBy: { score: "desc" }
        },
        quiz: {
          select: {
            questions: {
              select: { id: true } // only fetch question IDs
            }
          }
        }
      }
    });

    if (!leaderboard) {
      return res.status(404).json({ message: "Leaderboard not found for this quiz" });
    }

    // Format response 
    const formatted = leaderboard.entries.map((entry, index) => ({
      rank: index + 1,
      name: entry.user.name,
      username: entry.user.username,
      score: entry.score,
      timeTaken: entry.timeTaken
    }));

    res.json({
      quizid: leaderboard.quizid,
      totalQuestions: leaderboard.quiz.questions.length, // ✅ send total questions
      leaderboard: formatted
    });

  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});




// All Leaderboard for Created by Admin
app.get("/admin/results", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const decoded = JWT.verify(token, JWT_Pass);
    const adminId = decoded.id;


    const list = await prisma.quiz.findMany({
      where: {
        adminId,
        leaderboard: {
          isNot: null
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    res.json(list);

  } catch (err) {
    console.error("Error fetching admin quiz list with leaderboard:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

// All Leaderboard for Admin by id
app.get("/admin/results/:id", async (req, res) => {
  const token = req.headers.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {

    const quizid = req.params.id;


    const leaderboard = await prisma.leaderboard.findFirst({
      where: { quizid },
      include: {
        entries: {
          include: {
            user: {
              select: {
                name: true,
                username: true
              }
            }
          },
          orderBy: {
            score: 'desc'
          }
        }
      }
    });

    if (!leaderboard) {
      return res.status(404).json({ message: "Leaderboard not found for this quiz" });
    }

    // Format response
    const formatted = leaderboard.entries.map((entry, index) => ({
      rank: index + 1,
      name: entry.user.name,
      username: entry.user.username,
      score: entry.score
    }));

    res.json({
      quizid: leaderboard.quizid,
      leaderboard: formatted
    });

  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});







//  Start the server
app.listen(3000, "0.0.0.0", () => {
  console.log("Running on 0.0.0.0:3000");
});

