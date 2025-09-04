"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, CheckCircle2, AlertTriangle, Pencil, UploadCloud, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  rubric: Record<string, any>;
  module_id?: { _id: string; title: string } | string;
  course_id?: string;
}

interface SubmissionItem {
  _id: string;
  user_id: { _id: string; name?: string; email?: string };
  assignment_id: { _id: string; title: string; points: number };
  content?: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'pending' | 'graded' | 'late';
  submitted_at: string;
}

export default function InstructorAssignmentDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/assignments/${id}`);
        setAssignment(res.data);
        // Load submissions list for instructors
        try {
          setLoadingSubs(true);
          const subs = await axiosInstance.get(`/api/assignments/${id}/submissions`);
          const list = Array.isArray(subs.data?.submissions) ? subs.data.submissions : (Array.isArray(subs.data) ? subs.data : []);
          setSubmissions(list);
        } catch (_) {
          setSubmissions([]);
        } finally {
          setLoadingSubs(false);
        }
      } catch (error: any) {
        toast({ title: "Error", description: "Failed to load assignment", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div className="container py-8">Loading...</div>;
  if (!assignment) return <div className="container py-8">Assignment not found</div>;

  const statusBadge = (status: Assignment['status']) => {
    const map = {
      published: { text: 'Published', icon: CheckCircle2, variant: 'default' as const },
      draft: { text: 'Draft', icon: FileText, variant: 'secondary' as const },
      closed: { text: 'Closed', icon: AlertTriangle, variant: 'outline' as const },
    };
    const cfg = map[status];
    const Icon = cfg.icon;
    return (
      <Badge variant={cfg.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" /> {cfg.text}
      </Badge>
    );
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-blue-700">{assignment.title}</CardTitle>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{assignment.points} points</span>
                    </div>
                    {statusBadge(assignment.status)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-9"
                    onClick={() => window.location.href = `/instructor/assignments/${assignment._id}/edit`}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  {assignment.status !== 'published' && (
                    <Button
                      disabled={saving}
                      className="h-9 bg-green-600 hover:bg-green-700"
                      onClick={async () => {
                        try {
                          setSaving(true);
                          await axiosInstance.put(`/api/assignments/${assignment._id}`, { status: 'published' });
                          setAssignment({ ...assignment, status: 'published' });
                          toast({ title: 'Assignment published' });
                        } catch (e: any) {
                          toast({ title: 'Error', description: 'Failed to publish', variant: 'destructive' });
                        } finally {
                          setSaving(false);
                        }
                      }}
                    >
                      <UploadCloud className="h-4 w-4 mr-2" /> Publish
                    </Button>
                  )}
                  {assignment.status !== 'closed' && (
                    <Button
                      disabled={saving}
                      variant="destructive"
                      className="h-9"
                      onClick={async () => {
                        try {
                          setSaving(true);
                          await axiosInstance.put(`/api/assignments/${assignment._id}`, { status: 'closed' });
                          setAssignment({ ...assignment, status: 'closed' });
                          toast({ title: 'Assignment closed' });
                        } catch (e: any) {
                          toast({ title: 'Error', description: 'Failed to close', variant: 'destructive' });
                        } finally {
                          setSaving(false);
                        }
                      }}
                    >
                      <Ban className="h-4 w-4 mr-2" /> Close
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.description || '' }} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Available After</div>
                  <div className="font-medium">{new Date(assignment.availableAfter).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Submission Type</div>
                  <div className="font-medium capitalize">{assignment.submissionType}</div>
                </div>
                <div>
                  <div className="text-gray-500">Allowed Attempts</div>
                  <div className="font-medium">{assignment.allowedAttempts}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {Object.entries(assignment.rubric || {}).length === 0 && (
                  <div className="text-gray-500">No rubric configured</div>
                )}
                {Object.entries(assignment.rubric || {}).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span>{k}</span>
                    <span className="text-gray-600">{String(v)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSubs ? (
                <div className="text-sm text-gray-500">Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="text-sm text-gray-500">No submissions yet</div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((s) => {
                    const studentName = typeof s.user_id._id === 'string' ? s.user_id.name : (s.user_id.name || s.user_id.email || 'Student');
                    return (
                      <div key={s._id} className="border rounded-md p-3 text-sm hover:bg-gray-200">
                        <Link href={`/instructor/assignments/${assignment._id}/submissions/${s._id}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{studentName}</div>
                            <div className="text-xs text-gray-500">{new Date(s.submitted_at).toLocaleString()}</div>
                          </div>
                          <div className="text-xs capitalize">{s.status}</div>
                        </div>
                        {s.file_url && (
                          <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs mt-2 inline-block">
                            View file
                          </a>
                        )}
                        {typeof s.score === 'number' && (
                          <div className="mt-1 text-xs">Score: <span className="font-semibold">{s.score}</span>{assignment.points ? ` / ${assignment.points}` : ''}</div>
                        )}
                        {s.feedback && <div className="mt-1 text-xs text-gray-600">Feedback: {s.feedback}</div>}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

