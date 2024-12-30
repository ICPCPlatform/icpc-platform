import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
function Sidebar() {

    const users = [
        { handle: 'user1', online: Math.random() >= 0.5 },
        { handle: 'user2', online: Math.random() >= 0.5 },
        { handle: 'user3', online: Math.random() >= 0.5 },
        { handle: 'user4', online: Math.random() >= 0.5 },
        { handle: 'user5', online: Math.random() >= 0.5 },
    ];

    users.sort((a, b) => {
        if (a.online === b.online) {
            return a.handle.localeCompare(b.handle);
        }
        return Number(b.online) - Number(a.online);
    });
    const mentors = [
        { handle: 'mentor1', online: Math.random() >= 0.5 },
        { handle: 'mentor2', online: Math.random() >= 0.5 },
        { handle: 'mentor3', online: Math.random() >= 0.5 },
        { handle: 'mentor4', online: Math.random() >= 0.5 },
        { handle: 'mentor5', online: Math.random() >= 0.5 },
    ].filter(mentor => mentor.online);

    return (
        <div style={{ width: '400px', background: '#f4f4f4', padding: '10px' }}>
            <div className="friends-section">
                <div>Friends:(TBD)</div>
                <ul className='list-group'>
                    {
                        users.map((user) => (
                            <li className="list-group-item">
                                {user.handle} - {user.online ? 'Online' : 'Offline'}
                            </li>
                        ))
                    }
                </ul>

            </div>
            <div className="chatbot-section">Chatbot Mentor: Online</div>
            <div className="mentors-section">
                <div>Mentors Available:(TBD)</div>
                <ul className='list-group'>

                    {mentors.map((mentor) => (
                        <li className="list-group-item">
                            {mentor.handle} - {mentor.online ? 'Online' : 'Offline'}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
