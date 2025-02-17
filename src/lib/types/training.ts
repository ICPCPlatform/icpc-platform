export interface Announcement {
    date: string;
    message: string;
}

export interface Task {
    id: number;
    title: string;
    completed: boolean;
}

export interface ChatMessage {
    sender: 'Mentor' | 'You';
    message: string;
    timestamp: string;
}

export interface Mentor {
    id: number;
    name: string;
    status: 'Online' | 'Offline';
}

export interface Training {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'ongoing' | 'upcoming' | 'completed';
    enrollmentStatus: 'open' | 'closed';
    capacity: number;
    enrolled: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    mentors: string[];
    topics: string[];
    announcements: Announcement[];
    tasks: Task[];
    chatMessages: ChatMessage[];
}

export interface UserTraining extends Training {
    progress: number;
    joinedAt: string;
    lastAccessed?: string;
} 