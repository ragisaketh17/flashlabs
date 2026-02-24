import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // The backend expects x-www-form-urlencoded or JSON
            await axios.post(`${API_BASE}/login`, { username, password });
            // For simplicity in this demo, we assume login is successful if no error
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <GraduationCap size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
                <h1>Welcome Back</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Log in to your StudyBuddy account</p>

                {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
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
                        <LogIn size={18} /> Log In
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
