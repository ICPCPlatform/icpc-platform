import { Training } from '../types/training';

export const mockTraining: Training = {
    id: 'test',
    title: 'Advanced Software Development Training',
    announcements: [
        {
            date: '10/23',
            message: 'Reminder: Task 2 is due on 10/30.'
        },
        {
            date: '10/21',
            message: "New material added: 'Advanced Design Patterns.'"
        }
    ],
    tasks: [
        {
            id: 1,
            title: 'Implement feature X',
            completed: false
        },
        {
            id: 2,
            title: 'Submit project report',
            completed: false
        },
        {
            id: 3,
            title: 'Attend weekly session',
            completed: false
        }
    ],
    chatMessages: [
        {
            sender: 'Mentor',
            message: 'Let me know if you need help with Task 1!',
            timestamp: '2024-02-17T10:00:00Z'
        },
        {
            sender: 'You',
            message: 'Could you explain the second requirement?',
            timestamp: '2024-02-17T10:05:00Z'
        }
    ],
    mentors: [
        {
            id: 1,
            name: 'Mentor 1',
            status: 'Online'
        },
        {
            id: 2,
            name: 'Mentor 2',
            status: 'Offline'
        }
    ]
}; 