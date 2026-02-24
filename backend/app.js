const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const dbPath = path.join(__dirname, 'studybuddy.db');
let db = null;

app.post('/register', async (req, res) => {
    try {
        const { username, studentid, password } = req.body;

        if (!username || !studentid || !password) {
            return res.status(400).send("All fields are required");
        }
        const existingUser = await db.get(
            `SELECT * FROM users WHERE username = ?`,
            [username]
        );

        if (existingUser) {
            return res.send("Username already exists");
        }

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

        res.status(201).json({ message: "Registration successful" });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

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

        res.json({ message: "Login successful", user: { username: user.username } });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/courses', async (req, res) => {
    try {
        const courses = await db.all(`SELECT * FROM courses ORDER BY id`);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/courses', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: "Course name is required" });

        const result = await db.run(`INSERT INTO courses (name, description) VALUES (?, ?)`, [name, description || '']);
        const newCourse = await db.get(`SELECT * FROM courses WHERE id = ?`, [result.lastID]);
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/courses/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;
        await db.run(`UPDATE courses SET name = ?, description = ? WHERE id = ?`, [name, description, id]);
        const updatedCourse = await db.get(`SELECT * FROM courses WHERE id = ?`, [id]);
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.run(`DELETE FROM notes WHERE courseId = ?`, [id]); 
        await db.run(`DELETE FROM courses WHERE id = ?`, [id]);
        res.json({ message: "Course and its notes deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/courses/:courseId/notes', async (req, res) => {
    try {
        const { courseId } = req.params;
        const notes = await db.all(`SELECT * FROM notes WHERE courseId = ? ORDER BY id DESC`, [courseId]);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/courses/:courseId/notes', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, body } = req.body;
        if (!title || !body) return res.status(400).json({ error: "Title and body are required" });

        const result = await db.run(`INSERT INTO notes (title, body, courseId) VALUES (?, ?, ?)`, [title, body, courseId]);
        const newNote = await db.get(`SELECT * FROM notes WHERE id = ?`, [result.lastID]);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/notes/:id', async (req, res) => {
    try {
        const { title, body } = req.body;
        const { id } = req.params;
        await db.run(`UPDATE notes SET title = ?, body = ? WHERE id = ?`, [title, body, id]);
        const updatedNote = await db.get(`SELECT * FROM notes WHERE id = ?`, [id]);
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await db.get(`SELECT * FROM notes WHERE id = ?`, [id]);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.run(`DELETE FROM notes WHERE id = ?`, [id]);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/notes/:id/summarize', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await db.get(`SELECT * FROM notes WHERE id = ?`, [id]);
        if (!note) return res.status(404).json({ error: "Note not found" });

        const summary = `Summary of "${note.title}": This note discusses ${note.body.slice(0, 100)}... This core concept focuses on key learning objectives within the course material. (AI Generated)`;

        await db.run(`UPDATE notes SET summary = ? WHERE id = ?`, [summary, id]);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});


app.use(express.static(path.join(__dirname, '../frontend')));

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
    name TEXT NOT NULL,
    description TEXT
)
`);

        await db.run(`
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    summary TEXT,
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