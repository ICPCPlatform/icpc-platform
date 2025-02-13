export interface Training {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  enrollmentStatus: 'open' | 'closed';
  capacity: number;
  enrolled: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  mentors: string[];
  topics: string[];
}

export interface UserTraining extends Training {
  progress: number;
  joinedAt: string;
  lastAccessed?: string;
} 