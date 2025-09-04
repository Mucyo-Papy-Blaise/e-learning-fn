"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SubmissionDetailPage() {
  const { id, submissionId } = useParams(); 
  const { toast } = useToast();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number | undefined>();
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/api/assignments/${id}/submissions`);
        const found = res.data.find((s: any) => s._id === submissionId);
        if (found) {
          setSubmission(found);
          setScore(found.score);
          setFeedback(found.feedback || "");
        }
      } catch (e) {
        toast({ title: "Error", description: "Failed to load submission", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, submissionId]);

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/api/submissions/${submissionId}`, { score, feedback });
      toast({ title: "Saved", description: "Marks updated successfully" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to save marks", variant: "destructive" });
    }
  };

  if (loading) return <div className="container py-8">Loading...</div>;
  if (!submission) return <div className="container py-8">Submission not found</div>;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Submission by {submission.user_id?.name || submission.user_id?.email}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-gray-500 text-sm">Submitted At</div>
            <div className="font-medium">{new Date(submission.submitted_at).toLocaleString()}</div>
          </div>

          {submission.content && (
            <div>
              <div className="text-gray-500 text-sm">Response</div>
              <div className="border p-3 rounded-md">{submission.content}</div>
            </div>
          )}

          {submission.file_url && (
            <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View submitted file
            </a>
          )}

          <div>
            <label className="text-sm text-gray-500">Score</label>
            <Input type="number" value={score ?? ""} onChange={(e) => setScore(parseInt(e.target.value))} />
          </div>

          <div>
            <label className="text-sm text-gray-500">Feedback</label>
            <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} />
          </div>

          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Marks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
