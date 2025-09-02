'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios"; // Import axios
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { SubmissionForm } from "@/components/assignments/SubmissionForm";
import TiptapEditor from "@/components/ui/TipTap.Editor";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  due_date: string;
  max_points: number;
  requires_file: boolean;
  rubric: Record<string, any>;
}

interface Submission {
  _id: string;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'late';
  submitted_at: string;
}

export default function AssignmentPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL 
  const { id } = useParams(); // Get the moduleId from the URL params
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const assignmentRes = await axios.get(`${API_URL}/api/assignments/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      setAssignment(assignmentRes.data);

      const submissionRes = await axios.get(`${API_URL}/api/assignments/${assignmentRes.data._id}/submissions/me`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      const subs = Array.isArray(submissionRes.data) ? submissionRes.data : (Array.isArray(submissionRes.data?.submissions) ? submissionRes.data.submissions : [])
      if (subs && subs.length > 0) {
        setSubmission(subs[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assignment or submission",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Fetch again when moduleId changes

  // Function to handle successful submission
  const handleSubmissionSuccess = async (assignment_id: string) => {
    try {
      const token = localStorage.getItem("token");
      const submissionRes = await axios.get(`${API_URL}/api/assignments/${assignment_id}/submissions/me`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const subs = Array.isArray(submissionRes.data) ? submissionRes.data : (Array.isArray(submissionRes.data?.submissions) ? submissionRes.data.submissions : [])
      if (subs && subs.length > 0) {
        setSubmission(subs[0]);
      }
    } catch (error) {
      // console.error("Error fetching updated submission:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!assignment) return <div>Assignment not found</div>;

  const dueDate = new Date(assignment.due_date);
  const isOverdue = dueDate < new Date();

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 font-bold mb-4">{assignment.title}</CardTitle>
              <div className="flex items-center gap-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 text-black/50">
                  <Calendar className="h-4 w-4" />
                  <span className="font-semibold">Due: {dueDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-black/50 font-bold">
                  <Clock className="h-4 w-4" />
                  <span>{assignment.max_points} points</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assignment Description */}
              <div className="prose max-w-none dark:prose-invert">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Assignment Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{assignment.description}</p>
                </div>
              </div>

              {isOverdue && !submission && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-red-600">This assignment is overdue</p>
                </div>
              )}

              {submission ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: submission.content }} />
                    </div>
                    {submission.file_url && (
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View Attached File
                      </a>
                    )}
                    {submission.status === 'graded' && (
                      <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-blue-800">Score: {submission.score}/{assignment.max_points}</p>
                        {submission.feedback && (
                          <div>
                            <p className="font-medium text-blue-800 mb-1">Feedback:</p>
                            <p className="text-sm text-blue-700">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <SubmissionForm
                  assignmentId={assignment._id}
                  requiresFile={assignment.requires_file}
                  onSubmit={() => handleSubmissionSuccess(assignment._id)}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(assignment.rubric || {}).map(([criterion, points]) => (
                  <div key={criterion} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="font-medium">{criterion}</span>
                    <span className="text-blue-600 font-bold">{points} points</span>
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