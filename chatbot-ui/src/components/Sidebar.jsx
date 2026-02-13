
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ sessions, currentSessionId, onSelectSession, onNewChat }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    + New Chat
                </button>
            </div>
            <div className="sessions-list">
                {sessions.map(session => (
                    <div
                        key={session.id}
                        className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                        onClick={() => onSelectSession(session.id)}
                    >
                        <div className="session-title">{session.title || "New Chat"}</div>
                        <div className="session-date">{new Date(session.created_at).toLocaleDateString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
