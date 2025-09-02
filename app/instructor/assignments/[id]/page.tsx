"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

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

export default function InstructorAssignmentDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/assignments/${id}`);
        setAssignment(res.data);
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
        </div>
      </div>
    </div>
  );
}

