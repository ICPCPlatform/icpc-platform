import { Training } from '@/lib/types/training';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, MessageCircle, Book, FileText, Trophy, BellRing, Users, Medal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrainingViewProps {
    training: Training;
}

export default function TrainingView({ training }: TrainingViewProps) {
    // Mock standings data
    const standings = [
        { name: "Ahmed Hassan", score: 850, solved: 12 },
        { name: "Sarah Mohamed", score: 780, solved: 11 },
        { name: "Omar Ali", score: 720, solved: 10 },
        { name: "Nour Ibrahim", score: 690, solved: 9 },
        { name: "Youssef Ahmed", score: 650, solved: 8 },
    ];

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Phase 2: Dynamic Programming and Graph</h1>
                        <p className="text-muted-foreground mt-2">
                            Master advanced algorithms and problem-solving techniques
                        </p>
                    </div>
                    <Button>
                        Continue Learning
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Main Content - Left Column */}
                <div className="space-y-6">
                    {/* Tasks Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Tasks
                            </CardTitle>
                            <Button variant="outline" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {training.tasks.map((task) => (
                                    <div key={task.id} 
                                         className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                        <Checkbox id={`task-${task.id}`} checked={task.completed} />
                                        <label htmlFor={`task-${task.id}`} className="flex-1 text-sm">
                                            {task.title}
                                        </label>
                                        <Badge variant={task.completed ? "secondary" : "outline"}>
                                            {task.completed ? "Completed" : "Pending"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Practice & Contest Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Practice & Contests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="practice" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="practice">Practice Sheets</TabsTrigger>
                                    <TabsTrigger value="contest">Contest Sheets</TabsTrigger>
                                </TabsList>
                                <TabsContent value="practice">
                                    <div className="space-y-4">
                                        {['Basic Algorithms Practice', 'Data Structures Practice', 'Graph Problems'].map((sheet, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                                <div>
                                                    <div className="font-medium">{sheet}</div>
                                                    <div className="text-sm text-muted-foreground">15 problems</div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Start Practice
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="contest">
                                    <div className="space-y-4">
                                        {['Weekly Contest 1', 'Weekly Contest 2', 'Mock ICPC'].map((contest, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                                <div>
                                                    <div className="font-medium">{contest}</div>
                                                    <div className="text-sm text-muted-foreground">Duration: 3 hours</div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View Contest
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Materials Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Book className="h-5 w-5" />
                                Learning Materials
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {[1, 2, 3, 4].map((week) => (
                                        <Button
                                            key={week}
                                            variant={week === 1 ? "default" : "outline"}
                                            className="flex-shrink-0"
                                        >
                                            Week {week}
                                        </Button>
                                    ))}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {['Introduction to Algorithms', 'Data Structures Basics', 'Graph Theory', 'Dynamic Programming'].map((topic, index) => (
                                        <Card key={index} className="bg-muted/50">
                                            <CardContent className="p-4">
                                                <div className="font-medium mb-2">{topic}</div>
                                                <div className="flex justify-between items-center">
                                                    <Badge variant="secondary">Week 1</Badge>
                                                    <Button variant="ghost" size="sm">
                                                        View Material
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Standings Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Medal className="h-5 w-5" />
                                Standings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {standings.map((trainee, index) => (
                                    <div key={index} 
                                         className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                                                ${index === 0 ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                                                  index === 1 ? 'bg-gray-500/20 text-gray-700 dark:text-gray-400' :
                                                  index === 2 ? 'bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                                                  'bg-muted text-muted-foreground'}`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-medium">{trainee.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-semibold">{trainee.score}</span>
                                            <span className="text-xs text-muted-foreground">{trainee.solved} solved</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Announcements Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <BellRing className="h-5 w-5" />
                                Announcements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {training.announcements.map((announcement, index) => (
                                    <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-1">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            {announcement.date}
                                        </div>
                                        <p className="text-sm">
                                            {announcement.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat Section */}
                    <Card>
                        <CardHeader className="pb-3">
                            <Tabs defaultValue="group" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="group" className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        Group
                                    </TabsTrigger>
                                    <TabsTrigger value="mentor" className="flex items-center gap-1">
                                        <MessageCircle className="h-4 w-4" />
                                        Mentor
                                    </TabsTrigger>
                                    <TabsTrigger value="ai" className="flex items-center gap-1">
                                        <Bot className="h-4 w-4" />
                                        AI
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="group" className="mt-3">
                                    <div className="h-[400px] overflow-y-auto space-y-4 pr-4 mb-4">
                                        {training.chatMessages.map((message, index) => (
                                            <div key={index} 
                                                 className={`flex flex-col ${
                                                     message.sender === 'You' 
                                                     ? 'items-end' 
                                                     : 'items-start'
                                                 }`}>
                                                <div className="flex flex-col space-y-1">
                                                    <span className="text-xs text-muted-foreground mx-2">
                                                        {message.sender}
                                                    </span>
                                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                                                        message.sender === 'You'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted/50 dark:bg-muted/80'
                                                    }`}>
                                                        <div className="text-sm whitespace-pre-wrap">
                                                            {message.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="mentor" className="mt-3">
                                    <div className="h-[400px] overflow-y-auto space-y-4 pr-4 mb-4">
                                        <div className="text-center text-muted-foreground">
                                            Start a conversation with your mentor
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="ai" className="mt-3">
                                    <div className="h-[400px] overflow-y-auto space-y-4 pr-4 mb-4">
                                        <div className="text-center text-muted-foreground">
                                            Ask AI mentor for help
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <div className="border-t pt-4 mt-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type your message..."
                                        className="flex-1"
                                    />
                                    <Button size="icon" variant="outline">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    );
} 