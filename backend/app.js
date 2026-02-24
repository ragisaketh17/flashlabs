const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQLite Setup
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const dbPath = path.join(__dirname, 'studybuddy.db');
let db = null;

// ---------------- REGISTER API ----------------
app.post('/register', async (req, res) => {
    try {
        const { username, studentid, password } = req.body;

        if (!username || !studentid || !password) {
            return res.status(400).send("All fields are required");
        }

        // Check username
        const existingUser = await db.get(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );

        if (existingUser) {
            return res.send("Username already exists");
        }

        // Check studentId
        const existingStudent = await db.get(
            `SELECT * FROM users WHERE studentid = ?`,
            [studentid]
        );

        if (existingStudent) {
            return res.send("Student ID already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.run(
            `INSERT INTO users (username, studentid, password) VALUES (?, ?, ?)`,
            [username, studentid, hashedPassword]
        );

        res.redirect('/login.html');

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// ---------------- LOGIN API ----------------
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await db.get(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );

        if (!user) {
            return res.status(400).send("Invalid username");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Invalid password");
        }

        res.redirect('/index.html');

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all notes API
// Get all courses
// Get all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await db.all(`SELECT * FROM courses ORDER BY id`);
        res.json(courses); // Send courses as JSON
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Add a new course
app.post('/courses', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send("Course name is required");

        const result = await db.run(`INSERT INTO courses (name) VALUES (?)`, [name]);
        res.json({ message: "Course added successfully", courseId: result.lastID });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a course
app.delete('/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        await db.run(`DELETE FROM courses WHERE id = ?`, [courseId]);
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ---------------- INITIALIZE DB ----------------
const initializeServerAndDb = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        await db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    studentid TEXT UNIQUE,
    password TEXT
)
`);

await db.run(`
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
`);

await db.run(`
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    courseId INTEGER NOT NULL,
    FOREIGN KEY(courseId) REFERENCES courses(id)
)
`);
        app.listen(port, () =>
            console.log(`Server running at http://localhost:${port}`)
        );

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

initializeServerAndDb();