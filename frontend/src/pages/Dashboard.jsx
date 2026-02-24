import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const Dashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_BASE}/courses`);
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/courses`, { name, description });
            setName('');
            setDescription('');
            setShowForm(false);
            fetchCourses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Delete this course?")) {
            try {
                await axios.delete(`${API_BASE}/courses/${id}`);
                fetchCourses();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Courses</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/login')}>Logout</button>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <Plus size={18} /> New Course
                    </button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Add New Course</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input placeholder="Course Name" value={name} onChange={e => setName(e.target.value)} required />
                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary">Create</button>
                            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {courses.map(course => (
                    <Link to={`/course/${course.id}`} key={course.id} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0 }}>{course.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{course.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button onClick={(e) => handleDelete(course.id, e)} className="btn btn-danger" style={{ border: 'none', background: 'none' }}>
                                <Trash2 size={18} />
                            </button>
                            <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                        </div>
                    </Link>
                ))}
                {courses.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No courses yet.</p>}
            </div>
        </div>
    );
};

export default Dashboard;
