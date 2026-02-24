import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, UserPlus } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const Register = () => {
    const [username, setUsername] = useState('');
    const [studentid, setStudentid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/register`, { username, studentid, password });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or Student ID might already exist.');
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <GraduationCap size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
                <h1>Create Account</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Join the StudyBuddy community</p>

                {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        placeholder="Student ID"
                        value={studentid}
                        onChange={e => setStudentid(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                        <UserPlus size={18} /> Register
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login">Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
