"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubmissionsList } from "@/components/assignments/instructor/SubmissionsList";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  Settings,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle2,
  Edit3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  requires_file: boolean;
  rubric: Record<string, number>;
  course: {
    name: string;
    code: string;
  };
  status: 'active' | 'draft' | 'closed';
}

export default function InstructorAssignmentPage() {
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // Mock data for demonstration
        const mockAssignment: Assignment = {
          _id: "1",
          title: "Advanced React Patterns and Performance Optimization",
          description: "In this comprehensive assignment, you will demonstrate your understanding of advanced React patterns including render props, higher-order components, and custom hooks. You'll also implement performance optimizations using React.memo, useMemo, and useCallback. The project should showcase real-world application of these concepts in a meaningful way.",
          due_date: "2024-02-15T23:59:00Z",
          max_points: 100,
          requires_file: true,
          rubric: {
            "Code Quality & Structure": 25,
            "React Patterns Implementation": 30,
            "Performance Optimization": 25,
            "Documentation & Comments": 10,
            "Testing": 10
          },
          course: {
            name: "Advanced Web Development",
            code: "CS 4550"
          },
          status: 'active'
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAssignment(mockAssignment);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load assignment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [toast]);

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle2, text: 'Active' },
      draft: { variant: 'secondary' as const, icon: Edit3, text: 'Draft' },
      closed: { variant: 'outline' as const, icon: AlertTriangle, text: 'Closed' }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading assignment details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Assignment Not Found</h2>
            <p className="text-muted-foreground">The assignment you{"'"}re looking for doesn{"'"}t exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const daysUntilDue = getDaysUntilDue(assignment.due_date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{assignment.course.code} - {assignment.course.name}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                {assignment.title}
              </h1>
              <div className="flex items-center gap-4">
                {getStatusBadge(assignment.status)}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>25 students enrolled</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-blue-700">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Assignment
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Overview */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Assignment Overview
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(assignment.due_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>{assignment.max_points} points</span>
                    </div>
                  </div>
                </div>
                
                {daysUntilDue <= 7 && daysUntilDue > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none dark:prose-invert prose-slate">
                  <p className="text-base leading-relaxed">{assignment.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Submissions Section */}
            <SubmissionsList
              assignmentId={assignment._id}
              maxPoints={assignment.max_points}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Details */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm font-medium">Status</span>
                    {getStatusBadge(assignment.status)}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm font-medium">Max Points</span>
                    <span className="font-semibold">{assignment.max_points}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm font-medium">File Required</span>
                    <Badge variant={assignment.requires_file ? "default" : "secondary"}>
                      {assignment.requires_file ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Grading Rubric
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(assignment.rubric || {}).map(([criterion, points]) => (
                      <div key={criterion} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{criterion}</span>
                          <span className="text-sm font-semibold text-primary">{points} pts</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(points / assignment.max_points) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Grades
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Assignment Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}