"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Award,
  Users,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Edit3,
  AlertTriangle,
  Eye,
  Building2,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  availableAfter: string;
  points: number;
  submissionType: 'text' | 'file' | 'url' | 'multiple';
  allowedAttempts: number;
  status: 'draft' | 'published' | 'closed';
  isAnonymous: boolean;
  peerReviewEnabled: boolean;
  plagiarismCheckEnabled: boolean;
  course_id: string;
  module_id: {
    _id: string;
    title: string;
  };
  instructions: Array<{ 
    step: string; 
    content: string; 
    _id: string; 
  }>;
  attachments: any[];
  created_at: string;
  updated_at: string;
  createdBy?: {
    _id: string;
    name: string;
    role: string;
  };
}

interface Course {
  _id: string;
  title: string;
  code: string;
}

interface ModuleGroup {
  moduleId: string;
  moduleTitle: string;
  assignments: Assignment[];
  courseInfo: Course;
}

export default function AssignmentsOverviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [moduleGroups, setModuleGroups] = useState<ModuleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [creatorFilter, setCreatorFilter] = useState<string>("all");

  useEffect(() => {
    fetchAllAssignments();
  }, []);

  const fetchAllAssignments = async () => {
    try {
      setLoading(true);
      const url = new URL(window.location.href);
      const filterCourseId = url.searchParams.get('courseId');
      // Get all courses for the logged-in instructor
      const coursesResponse = await axiosInstance.get('/api/instructor/courses');
      let courses = coursesResponse.data.courses || coursesResponse.data || [];
      if (filterCourseId) {
        courses = courses.filter((c: any) => c._id === filterCourseId);
      }

      const allModuleGroups: ModuleGroup[] = [];

      // For each course, fetch its assignments
      for (const course of courses) {
        try {
          const response = await axiosInstance.get(`/api/assignments/course/${course._id}`);
          
          if (response.data && response.data.assignments) {
            const assignments = response.data.assignments;
            
            const courseInfo: Course = {
              _id: course._id,
              title: course.title,
              code: course.code
            };

            // Group assignments by module
            const moduleMap = new Map<string, Assignment[]>();

            assignments.forEach((assignment: Assignment) => {
              const moduleId = assignment.module_id._id;
              
              if (!moduleMap.has(moduleId)) {
                moduleMap.set(moduleId, []);
              }
              
              moduleMap.get(moduleId)?.push(assignment);
            });

            // Create module groups
            moduleMap.forEach((moduleAssignments, moduleId) => {
              const moduleTitle = moduleAssignments[0]?.module_id.title || "Unknown Module";
              
              allModuleGroups.push({
                moduleId,
                moduleTitle,
                assignments: moduleAssignments,
                courseInfo
              });
            });
          }
        } catch (error) {
          console.error(`Failed to fetch assignments for course ${course._id}:`, error);
        }
      }

      // Sort module groups by course and then by module title
      allModuleGroups.sort((a, b) => {
        const courseCompare = a.courseInfo.title.localeCompare(b.courseInfo.title);
        if (courseCompare !== 0) return courseCompare;
        return a.moduleTitle.localeCompare(b.moduleTitle);
      });

      setModuleGroups(allModuleGroups);
    } catch (error: any) {
      console.error('Failed to fetch assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: { variant: 'default' as const, icon: CheckCircle2, text: 'Published' },
      draft: { variant: 'secondary' as const, icon: Edit3, text: 'Draft' },
      closed: { variant: 'outline' as const, icon: AlertTriangle, text: 'Closed' }
    };

    const config = variants[status as keyof typeof variants] || variants.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getCreatorBadge = (role: string) => {
    const variants = {
      institution: { variant: 'default' as const, icon: Building2, text: 'Institution' },
      admin: { variant: 'secondary' as const, icon: UserCheck, text: 'Admin' },
      instructor: { variant: 'outline' as const, icon: Users, text: 'Instructor' }
    };

    const config = variants[role as keyof typeof variants] || variants.instructor;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSubmissionTypeBadge = (submissionType: string) => {
    const types = {
      text: "Text Entry",
      file: "File Upload", 
      url: "URL Submission",
      multiple: "Multiple Options"
    };
    return types[submissionType as keyof typeof types] || submissionType;
  };

  const filterAssignments = (assignments: Assignment[]) => {
    return assignments.filter(assignment => {
      const matchesSearch = searchTerm === "" || 
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
      
      // For now, all assignments are considered instructor-created
      const matchesCreator = creatorFilter === "all" || creatorFilter === "instructor";
      
      return matchesSearch && matchesStatus && matchesCreator;
    });
  };

  const getAllAssignments = () => {
    return moduleGroups.reduce((all, group) => [...all, ...group.assignments], [] as Assignment[]);
  };

  const getStatusCounts = () => {
    const allAssignments = getAllAssignments();
    const counts = { published: 0, draft: 0, closed: 0 };
    allAssignments.forEach(assignment => {
      counts[assignment.status]++;
    });
    return counts;
  };

  const getCreatorCounts = () => {
    const allAssignments = getAllAssignments();
    const counts = { institution: 0, admin: 0, instructor: 0 };
    // For now, assume all assignments are created by instructors since we don't have creator info
    counts.instructor = allAssignments.length;
    return counts;
  };

  const handleViewAssignment = (assignmentId: string) => {
    router.push(`/instructor/assignments/${assignmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading assignments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const creatorCounts = getCreatorCounts();
  const totalAssignments = getAllAssignments().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container py-8 space-y-8">
        {/* Header */}
<div className="flex flex-col md:flex-row items-start justify-between gap-4">
  <div className="space-y-1">
    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
      Institution Assignments
    </h1>
    <p className="text-sm text-gray-500">
      Manage and track assignments across your institution’s courses
    </p>
  </div>

  <Button
    className="bg-blue-600 hover:bg-blue-700 h-9 px-4 text-sm font-medium"
    onClick={() => router.push("/instructor/assignments/create")}
  >
    <Plus className="h-4 w-4 mr-2" />
    Create Assignment
  </Button>
</div>

{/* Stats Cards */}
<div className="grid grid-cols-2 md:grid-cols-6 gap-4">
  {[
    { label: "Total", value: totalAssignments, icon: FileText },
    { label: "Published", value: statusCounts.published, icon: CheckCircle2 },
    { label: "Drafts", value: statusCounts.draft, icon: Edit3 },
    { label: "Institution", value: creatorCounts.institution, icon: Building2 },
    { label: "Admin", value: creatorCounts.admin, icon: UserCheck },
    { label: "Instructor", value: creatorCounts.instructor, icon: Users },
  ].map((item, i) => (
    <Card
      key={i}
      className="border shadow-sm bg-white dark:bg-slate-900 rounded-md"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-lg font-semibold text-gray-800">
              {item.value}
            </p>
          </div>
          <item.icon className="h-5 w-5 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  ))}
</div>

{/* Search + Filters */}
<Card className="border shadow-sm bg-white dark:bg-slate-900 rounded-md">
  <CardContent className="p-4">
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Creator Filter */}
      <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-gray-400" />
        <select
          value={creatorFilter}
          onChange={(e) => setCreatorFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm"
        >
          <option value="all">All Creators</option>
          <option value="institution">Institution</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>
    </div>
  </CardContent>
</Card>

        {/* Assignments by Module */}
        <div className="space-y-6">
          {moduleGroups.length > 0 ? (
            moduleGroups.map((moduleGroup) => {
              const filteredAssignments = filterAssignments(moduleGroup.assignments);
              
              if (filteredAssignments.length === 0) return null;

              return (
                <Card key={`${moduleGroup.courseInfo._id}-${moduleGroup.moduleId}`} className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{moduleGroup.courseInfo.code} - {moduleGroup.courseInfo.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <div className="w-1 h-6 bg-primary rounded-full"></div>
                          {moduleGroup.moduleTitle}
                        </CardTitle>
                        <Badge variant="outline" className="text-sm">
                          {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredAssignments.map((assignment) => {
                        const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                        
                        return (
                          <Card 
                            key={assignment._id} 
                            className="hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                                    {assignment.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(assignment.status)}
                                    <Badge variant="outline" className="text-xs">
                                      <Users className="h-3 w-3 mr-1" />
                                      Instructor
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 space-y-3">
                              <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                </div>
                                
                                {daysUntilDue <= 7 && daysUntilDue > 0 && (
                                  <div className="flex items-center gap-1 text-amber-600">
                                    <Clock className="h-3 w-3" />
                                    <span>Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
                                
                                {daysUntilDue < 0 && (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  <span>{assignment.points} points</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{assignment.allowedAttempts} attempt{assignment.allowedAttempts !== 1 ? 's' : ''}</span>
                                </div>
                              </div>

                              {/* Assignment Features */}
                              <div className="flex flex-wrap gap-1">
                                {assignment.isAnonymous && (
                                  <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                                )}
                                {assignment.peerReviewEnabled && (
                                  <Badge variant="secondary" className="text-xs">Peer Review</Badge>
                                )}
                                {assignment.plagiarismCheckEnabled && (
                                  <Badge variant="secondary" className="text-xs">Plagiarism Check</Badge>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                                <div className="text-xs text-muted-foreground">
                                  Created: {new Date(assignment.created_at).toLocaleDateString()}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-xs hover:bg-blue-100 dark:hover:bg-blue-900"
                                    onClick={() => handleViewAssignment(assignment._id)}
                                    title="View Assignment Details"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => router.push(`/instructor/assignments/${assignment._id}/edit`)}
                                    title="Edit Assignment"
                                  >
                                    <Edit3 className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    {totalAssignments === 0 ? "No Assignments Yet" : "No Assignments Found"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {totalAssignments === 0 
                      ? "Create your first assignment to get started"
                      : "Try adjusting your search or filter criteria"
                    }
                  </p>
                  {totalAssignments === 0 && (
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push('/instructor/assignments/create')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Assignment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Show filtered results info */}
        {moduleGroups.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {moduleGroups.reduce((total, group) => total + filterAssignments(group.assignments).length, 0)} of {totalAssignments} assignments
          </div>
        )}
      </div>
    </div>
  );
}