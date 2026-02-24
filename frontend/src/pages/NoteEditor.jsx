import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const NoteEditor = () => {
    const { id, courseId } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            axios.get(`${API_BASE}/notes/${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setBody(res.data.body);
                    setLoading(false);
                })
                .catch(err => { console.error(err); setLoading(false); });
        }
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${API_BASE}/notes/${id}`, { title, body });
            } else {
                await axios.post(`${API_BASE}/courses/${courseId}/notes`, { title, body });
            }
            navigate(-1);
        } catch (err) { console.error(err); }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div className="breadcrumbs">
                <Link to="#" onClick={() => navigate(-1)}>Back</Link> / {isEditing ? 'Edit Note' : 'New Note'}
            </div>

            <div className="card">
                <h1 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Note' : 'Create New Note'}</h1>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note Title" required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Content (Markdown)</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your notes here..." style={{ minHeight: '300px' }} required />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary"><Save size={18} /> Save Note</button>
                        <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteEditor;
