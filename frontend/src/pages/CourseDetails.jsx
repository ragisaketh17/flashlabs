import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, Trash2, Edit, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_BASE = 'http://localhost:3000';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summarizingId, setSummarizingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const corsRes = await axios.get(`${API_BASE}/courses`);
                setCourse(corsRes.data.find(c => c.id === parseInt(id)));
                const notesRes = await axios.get(`${API_BASE}/courses/${id}/notes`);
                setNotes(notesRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    const handleSummarize = async (noteId) => {
        setSummarizingId(noteId);
        try {
            await axios.post(`${API_BASE}/notes/${noteId}/summarize`);
            const notesRes = await axios.get(`${API_BASE}/courses/${id}/notes`);
            setNotes(notesRes.data);
        } catch (err) { console.error(err); }
        finally { setSummarizingId(null); }
    };

    const handleDelete = async (noteId) => {
        if (confirm("Delete note?")) {
            try {
                await axios.delete(`${API_BASE}/notes/${noteId}`);
                setNotes(notes.filter(n => n.id !== noteId));
            } catch (err) { console.error(err); }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!course) return <p>Course not found. <Link to="/">Go back</Link></p>;

    return (
        <div>
            <div className="breadcrumbs">
                <Link to="/">Dashboard</Link> / {course.name}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{course.name}</h1>
                <button className="btn btn-primary" onClick={() => navigate(`/course/${id}/note/new`)}>
                    <Plus size={18} /> New Note
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {notes.map(note => (
                    <div key={note.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <h2>{note.title}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-outline" onClick={() => handleSummarize(note.id)} disabled={summarizingId === note.id}>
                                    {summarizingId === note.id ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                    Summarize
                                </button>
                                <button className="btn btn-outline" onClick={() => navigate(`/note/${note.id}/edit`)}><Edit size={16} /></button>
                                <button className="btn btn-danger" style={{ border: 'none', background: 'none' }} onClick={() => handleDelete(note.id)}><Trash2 size={16} /></button>
                            </div>
                        </div>

                        {note.summary && (
                            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', borderLeft: '3px solid var(--accent-color)', fontSize: '0.9rem' }}>
                                <strong>Summary:</strong> {note.summary}
                            </div>
                        )}

                        <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                            <ReactMarkdown>{note.body}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {notes.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No notes yet.</p>}
            </div>
        </div>
    );
};

export default CourseDetails;
