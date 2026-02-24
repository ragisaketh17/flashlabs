import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import NoteEditor from './pages/NoteEditor';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/course/:courseId/note/new" element={<NoteEditor />} />
          <Route path="/note/:id/edit" element={<NoteEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
