1️⃣ ER Diagram – SQLite Schema

You can include this as an image in /docs/er_diagram.png in your repo. Here’s the structure visually:

+---------+       1      +---------+       1      +-------+
|  Users  |────────────▶ | Courses |────────────▶ | Notes |
+---------+              +---------+              +-------+
| id (PK) |              | id (PK)|              | id(PK)|
| username|              | user_id(FK) |          | course_id(FK) |
| email   |              | title  |              | title |
| password|              | description |         | content |
+---------+              | created_at |          | created_at |
                         +-----------+          | summary |
                                                 +-------+

Relationships:

Users → Courses: One-to-Many

Courses → Notes: One-to-Many

Cascade delete on Courses → Notes

You can create this in Figma, Lucidchart, or even draw.io, then export as PNG for README.

2️⃣ Workflow Diagram – StudyBuddy Flow

This shows how a user interacts with your system:

User
 │
 ▼
Create / View Courses
 │
 ▼
Select Course
 │
 ▼
Create / View Notes
 │
 ▼
Click "Summarize" ───▶ AI Summarization API
 │
 ▼
Display Summary to User

Optional Annotations:

Courses and Notes use full CRUD

Summarization uses LLM API (e.g., GPT-3.5 free tier)

Notes linked to Courses via SQLite foreign key

Also export as a PNG and save as /docs/workflow_diagram.png to include in README.

3️⃣ How to Include in README.md
## Database Schema

![ER Diagram](./docs/er_diagram.png)

## StudyBuddy Workflow

![Workflow Diagram](./docs/workflow_diagram.png)
