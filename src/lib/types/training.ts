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
    announcements: Announcement[];
    tasks: Task[];
    chatMessages: ChatMessage[];
    mentors: Mentor[];
}

export interface UserTraining extends Training {
  progress: number;
  joinedAt: string;
  lastAccessed?: string;
} 