"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/api/courses";
import { TiptapEditor } from "../ui/editor";

const submissionSchema = z.object({
  content: z.string().min(1, "Submission content is required"),
  file: z.instanceof(File).optional(),
}).refine((data) => {
  // If no content and no file, show error
  if (!data.content.trim() && !data.file) {
    return false;
  }
  return true;
}, {
  message: "Either text content or file upload is required",
  path: ["content"]
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface SubmissionFormProps {
  assignmentId: string;
  requiresFile?: boolean;
  allowsText?: boolean;
  allowsFile?: boolean;
  onSubmit: () => void;
}

export function SubmissionForm({ 
  assignmentId, 
  requiresFile = false, 
  allowsText = true, 
  allowsFile = true, 
  onSubmit 
}: SubmissionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const onSubmitForm = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // Always append content (even if empty, backend can handle it)
      formData.append("content", data.content || "");
      
      if (data.file) {
        formData.append("file", data.file);
      }

      // Use documented endpoint: POST /api/assignments/:assignmentId/submit
      const response = await fetch(`${API_URL}/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit assignment");
      }

      toast({
        title: "Success",
        description: "Assignment submitted successfully",
      });
      onSubmit();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {allowsText && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Response {requiresFile ? "(Optional)" : "*"}
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TiptapEditor
                name="submission-content"
                content={value || ""}
                onChange={onChange}
                placeholder="Enter your submission here..."
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>
      )}

      {allowsFile && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Upload {requiresFile ? "*" : "(Optional)"}
          </label>
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                type="file"
                onChange={(e) => onChange(e.target.files?.[0])}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                {...field}
              />
            )}
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF
          </p>
        </div>
      )}

      <Button className="bg-blue-700" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Assignment"}
      </Button>
    </form>
  );
}

