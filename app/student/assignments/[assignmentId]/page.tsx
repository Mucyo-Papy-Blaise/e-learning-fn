'use client'
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { SubmissionForm } from "@/components/assignments/SubmissionForm";
import { useAssignment, useMyAssignmentSubmission } from "@/lib/hooks/assignments";


export default function AssignmentPage() {
  const { assignmentId } = useParams() as { assignmentId: string };
  const { data: assignment, isLoading, error } = useAssignment(assignmentId);
  const { data: submission } = useMyAssignmentSubmission(assignment?._id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !assignment) return <div>Assignment not found</div>;

  const dueDate = new Date(assignment.dueDate); 
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
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{assignment.points} points</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none dark:prose-invert">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Assignment Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.description || '' }} />
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
                        <p className="font-medium text-blue-800">Score: {submission.score}/{assignment.points}</p>
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
                  requiresFile={assignment.submissionType === "file"}
                  allowsText={assignment.submissionType === "text" || assignment.submissionType === "multiple"}
                  allowsFile={assignment.submissionType === "file" || assignment.submissionType === "multiple"}
                  onSubmit={() => {}}
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
              {assignment.rubric.split("\n").map((line: any, index: any) => (
                <p key={index}>{line}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
