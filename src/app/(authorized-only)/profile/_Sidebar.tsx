import React from "react";
import { FaUserFriends, FaRobot, FaChalkboardTeacher } from 'react-icons/fa';

export default function Sidebar({ className }: { className?: string }) {
  const users = [
    { handle: "user1", online: Math.random() >= 0.5 },
    { handle: "user2", online: Math.random() >= 0.5 },
    { handle: "user3", online: Math.random() >= 0.5 },
    { handle: "user4", online: Math.random() >= 0.5 },
    { handle: "user5", online: Math.random() >= 0.5 },
  ];

  users.sort((a, b) => {
    if (a.online === b.online) {
      return a.handle.localeCompare(b.handle);
    }
    return Number(b.online) - Number(a.online);
  });

  const mentors = [
    { handle: "mentor1", online: Math.random() >= 0.5 },
    { handle: "mentor2", online: Math.random() >= 0.5 },
    { handle: "mentor3", online: Math.random() >= 0.5 },
    { handle: "mentor4", online: Math.random() >= 0.5 },
    { handle: "mentor5", online: Math.random() >= 0.5 },
  ].filter((mentor) => mentor.online);

  return (
    <aside className={`w-[280px] p-4 ${className || ''}`}>
      <div className="friends-section">
        <div className="section-header">
          <FaUserFriends />
          <span>Friends</span>
        </div>
        <ul className="space-y-1.5">
          {users.map((user, idx) => (
            <li className="list-group-item" key={idx}>
              <div className="user-info-container">
                <span className="user-handle">{user.handle}</span>
                <div className="status-wrapper">
                  <span className={`status-indicator ${user.online ? 'status-online' : 'status-offline'}`} />
                  <span className="status-text">
                    {user.online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chatbot-section">
        <FaRobot className="inline-block mr-2 text-sm" />
        <span>Chatbot Mentor: Online</span>
      </div>

      <div className="mentors-section">
        <div className="section-header">
          <FaChalkboardTeacher />
          <span>Available Mentors</span>
        </div>
        <ul className="space-y-1.5">
          {mentors.map((mentor, idx) => (
            <li className="list-group-item" key={idx}>
              <div className="user-info-container">
                <span className="user-handle">{mentor.handle}</span>
                <div className="status-wrapper">
                  <span className="status-indicator status-online" />
                  <span className="status-text">Online</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

