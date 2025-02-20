import { Training, UserTraining } from "../types/training";

export const mockUserTrainings: UserTraining[] = [
  {
    id: "1",
    title: "Phase 1: Data Structures & Algorithms",
    description:
      "Master essential data structures and algorithms including STLs, Frequency Arrays, Prefix Sum, and Two Pointers techniques.",
    startDate: "2024-01-01",
    endDate: "2024-03-01",
    status: "ongoing",
    enrollmentStatus: "closed",
    capacity: 150,
    enrolled: 125,
    level: "intermediate",
    mentors: ["Mohamed Ahmed", "Sara Hassan"],
    topics: [
      "STLs",
      "Frequency Array",
      "Prefix Sum",
      "Two Pointers",
      "Binary Search",
      "Sorting Techniques",
    ],
    progress: 60,
    joinedAt: "2024-01-01",
    lastAccessed: "2024-02-15",
  },
  {
    id: "2",
    title: "Newcomers: C++ Fundamentals",
    description:
      "Learn the basics of C++ programming language, including syntax, control structures, functions, and basic problem-solving techniques.",
    startDate: "2024-02-01",
    endDate: "2024-03-15",
    status: "ongoing",
    enrollmentStatus: "closed",
    capacity: 200,
    enrolled: 180,
    level: "beginner",
    mentors: ["Ali Mohamed", "Nour Ibrahim"],
    topics: [
      "C++ Basics",
      "Control Flow",
      "Functions",
      "Arrays",
      "Strings",
      "Basic Math",
    ],
    progress: 75,
    joinedAt: "2024-02-01",
    lastAccessed: "2024-02-14",
  },
];

export const mockAvailableTrainings: Training[] = [
  {
    id: "3",
    title: "Phase 2: Advanced Algorithms",
    description:
      "Deep dive into advanced algorithmic concepts including Dynamic Programming, Graph Theory, and advanced data structures.",
    startDate: "2024-03-01",
    endDate: "2024-05-01",
    status: "upcoming",
    enrollmentStatus: "open",
    capacity: 100,
    enrolled: 45,
    level: "advanced",
    mentors: ["Dr. Ahmed Sayed", "Mostafa Ibrahim"],
    topics: [
      "Dynamic Programming",
      "Graph Algorithms",
      "Segment Trees",
      "Advanced Number Theory",
      "Network Flow",
    ],
  },
  {
    id: "4",
    title: "Newcomers: Introduction to CP",
    description:
      "Start your competitive programming journey with C++ fundamentals and basic problem-solving techniques.",
    startDate: "2024-03-15",
    endDate: "2024-05-01",
    status: "upcoming",
    enrollmentStatus: "open",
    capacity: 250,
    enrolled: 125,
    level: "beginner",
    mentors: ["Youssef Ali", "Mariam Hassan"],
    topics: [
      "C++ Basics",
      "Problem Solving",
      "Time Complexity",
      "Basic Math",
      "Arrays & Strings",
    ],
  },
  {
    id: "5",
    title: "Semi-Seniors Training",
    description:
      "Advanced training for experienced competitive programmers, covering complex algorithms and contest strategies.",
    startDate: "2024-04-01",
    endDate: "2024-06-01",
    status: "upcoming",
    enrollmentStatus: "open",
    capacity: 50,
    enrolled: 15,
    level: "advanced",
    mentors: ["Mohamed Reda", "Ahmed Gamal"],
    topics: [
      "Advanced DP",
      "Advanced Graph Theory",
      "String Algorithms",
      "Geometry",
      "Contest Strategy",
    ],
  },
  {
    id: "6",
    title: "Phase 1: Spring Training",
    description:
      "Master fundamental algorithms and data structures essential for competitive programming.",
    startDate: "2024-04-15",
    endDate: "2024-06-15",
    status: "upcoming",
    enrollmentStatus: "open",
    capacity: 150,
    enrolled: 30,
    level: "intermediate",
    mentors: ["Omar Hassan", "Asmaa Mohamed"],
    topics: [
      "STLs",
      "Binary Search",
      "Two Pointers",
      "Prefix Sum",
      "Frequency Array",
      "Basic Number Theory",
    ],
  },
];
