'use client'
import { useEffect, useState } from 'react'
import { getExamById, listExams } from '@/app/lib/api'
import type { Exam } from '@/lib/types/assessments'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function InstructorExamsListPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const res = await listExams()
      if (!mounted) return
      if (res.ok) setExams(res.data.exams)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/instructor">Instructor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Exams</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Exams</h1>
          <Button asChild>
            <Link href="/instructor/exams/new">New Exam</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Passing</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map(e => (
                  <TableRow key={e._id}>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell className="max-w-[360px] truncate" title={e.description}>{e.description}</TableCell>
                    <TableCell>{e.course}</TableCell>
                    <TableCell>{e.duration ?? '-'} min</TableCell>
                    <TableCell>{e.passingScore ?? '-'}</TableCell>
                    <TableCell>{e.totalPoints ?? '-'}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/instructor/exams/${e._id}`} className="text-primary underline">View/Edit</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
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
  Trash2,
  File,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axios";

interface Exam {
  _id: string;
  title: string;
  course: {
    _id: string;
    title: string;
    code: string;
  };
  description?: string;
  instructions?: string;
  examContent: string;
  attachments?: string[];
  startDate: string;
  endDate: string;
  duration: number;
  status: 'draft' | 'published';
  passingScore?: number;
  maxAttempts?: number;
  allowFileSubmission?: boolean;
  allowTextSubmission?: boolean;
  submissionInstructions?: string;
  gradingCriteria?: string;
  totalPoints?: number;
  isRandomized?: boolean;
  showResults?: boolean;
  allowReview?: boolean;
  createdBy?: {
    _id: string;
    name: string;
    role: string;
  };
  institution?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ExamsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterCourseId = searchParams.get('courseId');
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/exams');
      let items = response.data.exams || [];
      if (filterCourseId) {
        items = items.filter((e: any) => (e.course?._id || e.course) === filterCourseId);
      }
      setExams(items);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: { variant: 'default' as const, icon: CheckCircle2, text: 'Published' },
      draft: { variant: 'secondary' as const, icon: Edit3, text: 'Draft' }
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

  const getExamStatus = (exam: Exam): string => {
    // First check if the exam has a status field
    if (exam.status) {
      return exam.status;
    }
    
    // Fallback to time-based status calculation
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);

    if (now < startDate) return 'draft';
    if (now >= startDate && now <= endDate) return 'active';
    if (now > endDate) return 'completed';
    return 'draft';
  };

  const filterExams = (exams: Exam[]) => {
    return exams.filter(exam => {
      const matchesSearch = searchTerm === "" || 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        exam.course.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusCounts = () => {
    const counts = { published: 0, draft: 0, total: 0 };
    exams.forEach(exam => {
      counts.total++;
      if (exam.status === 'published') counts.published++;
      else counts.draft++;
    });
    return counts;
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      await axiosInstance.delete(`/api/exams/${examId}`);
      toast({
        title: "Success",
        description: "Exam deleted successfully",
      });
      fetchExams();
    } catch (error) {
      console.error('Failed to delete exam:', error);
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading exams...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const filteredExams = filterExams(exams);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Institution Exams
            </h1>
            <p className="text-muted-foreground">
              View and manage all exams across your institution's courses
            </p>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push('/instructor/exams/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Exam
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold">{statusCounts.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold text-green-600">{statusCounts.published}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                  <p className="text-3xl font-bold text-gray-600">{statusCounts.draft}</p>
                </div>
                <Edit3 className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {exams.filter(exam => {
                      const now = new Date();
                      const startDate = new Date(exam.startDate);
                      const endDate = new Date(exam.endDate);
                      return now >= startDate && now <= endDate;
                    }).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exams List */}
        <div className="space-y-6">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => {
              const now = new Date();
              const startDate = new Date(exam.startDate);
              const endDate = new Date(exam.endDate);
              const isActive = now >= startDate && now <= endDate;
              const isUpcoming = now < startDate;
              const isCompleted = now > endDate;

              return (
                <Card key={exam._id} className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {exam.course.code} - {exam.course.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{exam.title}</h3>
                          {getStatusBadge(exam.status)}
                          {isActive && (
                            <Badge variant="default" className="bg-green-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          {isUpcoming && (
                            <Badge variant="secondary">
                              <Calendar className="h-3 w-3 mr-1" />
                              Upcoming
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="outline">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        {exam.description && (
                          <p className="text-muted-foreground line-clamp-2">
                            {exam.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Exam Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Start: {new Date(exam.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>End: {new Date(exam.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration} minutes</span>
                      </div>
                    </div>

                    {/* Submission Options */}
                    <div className="flex flex-wrap gap-2">
                      {exam.allowTextSubmission && (
                        <Badge variant="secondary" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Text Submission
                        </Badge>
                      )}
                      {exam.allowFileSubmission && (
                        <Badge variant="secondary" className="text-xs">
                          <Upload className="h-3 w-3 mr-1" />
                          File Submission
                        </Badge>
                      )}
                      {exam.totalPoints && (
                        <Badge variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {exam.totalPoints} points
                        </Badge>
                      )}
                      {exam.maxAttempts && exam.maxAttempts > 1 && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {exam.maxAttempts} attempts
                        </Badge>
                      )}
                    </div>

                    {/* Attachments */}
                    {exam.attachments && exam.attachments.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Attachments:</Label>
                        <div className="flex flex-wrap gap-2">
                          {exam.attachments.map((attachment, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <File className="h-3 w-3 mr-1" />
                              File {index + 1}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(exam.createdAt).toLocaleDateString()}
                        {exam.createdBy && (
                          <span className="ml-2">
                            by {exam.createdBy.name} ({exam.createdBy.role})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs hover:bg-blue-100 dark:hover:bg-blue-900"
                          onClick={() => router.push(`/instructor/exams/${exam._id}`)}
                          title="View Exam Details"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => router.push(`/instructor/exams/${exam._id}/edit`)}
                          title="Edit Exam"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                          onClick={() => handleDeleteExam(exam._id)}
                          title="Delete Exam"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
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
                    {exams.length === 0 ? "No Exams Yet" : "No Exams Found"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {exams.length === 0 
                      ? "Create your first exam to get started"
                      : "Try adjusting your search or filter criteria"
                    }
                  </p>
                  {exams.length === 0 && (
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push('/instructor/exams/new')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Exam
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Show filtered results info */}
        {exams.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredExams.length} of {exams.length} exams
          </div>
        )}
      </div>
    </div>
  );
}
