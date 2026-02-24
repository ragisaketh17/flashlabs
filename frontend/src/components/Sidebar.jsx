import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, LayoutDashboard, Settings, GraduationCap } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <GraduationCap className="logo-icon" />
                <span>StudyBuddy</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/courses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Book size={20} />
                    <span>My Courses</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
