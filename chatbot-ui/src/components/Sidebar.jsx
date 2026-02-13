
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ sessions, currentSessionId, onSelectSession, onNewChat, user, onLogout, onDeleteSession }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    + New Chat
                </button>
            </div>
            <div className="sessions-list">
                {sessions.map((session, index) => (
                    <div key={session.session_id || `session-${index}`} className={`session-item ${session.session_id === currentSessionId ? 'active' : ''}`}>
                        <div className="session-content" onClick={() => onSelectSession(session.session_id)}>
                            <div className="session-title">{session.title}</div>
                            <div className="session-date">{new Date(session.created_at).toLocaleDateString()}</div>
                        </div>
                        <button
                            className="delete-session-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.session_id);
                            }}
                            title="Delete chat"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                <div className="sidebar-user-info">
                    <div className="sidebar-user-avatar">
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="sidebar-user-details">
                        <div className="sidebar-user-email">{user?.email || user?.displayName}</div>
                    </div>
                </div>
                <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
