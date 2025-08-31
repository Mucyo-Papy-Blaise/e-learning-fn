"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/ui/TipTap.Editor";
import axiosInstance from "@/lib/axios";

const instructionSchema = z.object({
  step: z.string().min(1, "Step is required"),
  content: z.string().min(1, "Content is required"),
});

const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.date(),
  availableAfter: z.date(),
  points: z.number().min(1, "Points must be at least 1"),
  submissionType: z.enum(['text', 'file', 'url', 'multiple']),
  allowedAttempts: z.number().min(1, "At least 1 attempt must be allowed"),
  status: z.enum(['draft', 'published', 'closed']),
  isAnonymous: z.boolean(),
  peerReviewEnabled: z.boolean(),
  plagiarismCheckEnabled: z.boolean(),
  instructions: z.array(instructionSchema),
  attachments: z.array(z.string()).optional(),
  rubric: z.record(z.string(), z.any()).optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

export function CreateAssignmentForm({ 
  moduleId, 
  courseId 
}: { 
  moduleId: string; 
  courseId: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      submissionType: 'file',
      allowedAttempts: 1,
      status: 'draft',
      isAnonymous: false,
      peerReviewEnabled: false,
      plagiarismCheckEnabled: false,
      instructions: [{ step: "Step 1", content: "" }],
      attachments: [],
      rubric: {},
      availableAfter: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructions",
  });

  const onSubmit = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      // Using your existing axiosInstance - token is automatically added by interceptor
      const response = await axiosInstance.post('/api/assignments', {
        ...data,
        module_id: moduleId,
        course_id: courseId
      });

      toast({ 
        title: "Success", 
        description: "Assignment created successfully" 
      });
      
      router.push(`/instructor/courses/${courseId}`);
    } catch (error: any) {
      console.error('Assignment creation error:', error);
      
      // Your axios instance already handles error toasts, but we can add specific handling
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to create assignment";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of your component remains the same...
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Assignment
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up a new assignment for your students
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg p-8 space-y-6">
          
          {/* Title */}
          <div>
            <Label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assignment Title
            </Label>
            <Input
              id="title"
              placeholder="Enter assignment title"
              {...register("title")}
              className={`w-full ${errors.title ? "border-red-400" : ""}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TiptapEditor
                  name={field.name}
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Describe what students need to do..."
                  className={`bg-white border rounded-md ${errors.description ? "border-red-400" : "border-gray-300"}`}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available After
              </Label>
              <Controller
                name="availableAfter"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label=""
                    onChange={field.onChange}
                    value={field.value}
                    error={errors.availableAfter?.message}
                  />
                )}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label=""
                    onChange={field.onChange}
                    value={field.value}
                    error={errors.dueDate?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Points and Attempts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                placeholder="100"
                {...register("points", { valueAsNumber: true })}
                className={errors.points ? "border-red-400" : ""}
              />
              {errors.points && (
                <p className="text-red-500 text-sm mt-1">{errors.points.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="allowedAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Allowed Attempts
              </Label>
              <Input
                id="allowedAttempts"
                type="number"
                placeholder="1"
                {...register("allowedAttempts", { valueAsNumber: true })}
                className={errors.allowedAttempts ? "border-red-400" : ""}
              />
              {errors.allowedAttempts && (
                <p className="text-red-500 text-sm mt-1">{errors.allowedAttempts.message}</p>
              )}
            </div>
          </div>

          {/* Submission Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Submission Type
              </Label>
              <Controller
                name="submissionType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select submission type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Entry</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="url">URL Submission</SelectItem>
                      <SelectItem value="multiple">Multiple Options</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Instructions
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ step: `Step ${fields.length + 1}`, content: "" })}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Step {index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Step title"
                    {...register(`instructions.${index}.step`)}
                    className="mb-3"
                  />
                  <Controller
                    name={`instructions.${index}.content`}
                    control={control}
                    render={({ field }) => (
                      <TiptapEditor
                        name={field.name}
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Step instructions"
                        className="bg-white border border-gray-300 rounded-md"
                      />
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Boolean Options */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Options
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div>
                  <Label className="text-sm font-medium">Anonymous Grading</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hide student names during grading</p>
                </div>
                <Controller
                  name="isAnonymous"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div>
                  <Label className="text-sm font-medium">Peer Review</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable peer review for this assignment</p>
                </div>
                <Controller
                  name="peerReviewEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div>
                  <Label className="text-sm font-medium">Plagiarism Check</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Check submissions for plagiarism</p>
                </div>
                <Controller
                  name="plagiarismCheckEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}