"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  FileText, 
  Calendar, 
  Award, 
  Upload,
  Target,
  BookOpen
} from "lucide-react";
import { API_URL } from "@/lib/api/courses";

const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  due_date: z.date(),
  max_points: z.number().min(1, "Points must be at least 1"),
  requires_file: z.boolean(),
  rubric: z.record(z.string(), z.number()).optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

export function CreateAssignmentForm({ moduleId, onSuccess }: { moduleId: string; onSuccess: () => void }) {
  const { toast } = useToast();
  const { control, register, handleSubmit, formState: { errors } } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      requires_file: false,
      rubric: {},
    },
  });

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ ...data, module_id: moduleId }),
      });

      if (!response.ok) throw new Error("Failed to create assignment");
      
      toast({ title: "Success", description: "Assignment created successfully" });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-2 overflow-x-auto">
      <div className="container max-w-2xl mx-auto space-y-2">
        {/* Header */}
          <h1 className="pl-5 text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Create New Assignment
          </h1>

        <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Field */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Assignment Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title for your assignment"
                  {...register("title")}
                  className={`h-12 text-sm ${errors.title ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20" : "border-slate-200 focus:border-blue-500 bg-white dark:bg-slate-800"} transition-all duration-200 shadow-sm`}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Description & Instructions
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed instructions, learning objectives, and expectations for this assignment..."
                  rows={6}
                  {...register("description")}
                  className={`text-base resize-none ${errors.description ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20" : "border-slate-200 focus:border-blue-500 bg-white dark:bg-slate-800"} transition-all duration-200 shadow-sm`}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Due Date and Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Controller
                    name="due_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label=""
                        onChange={field.onChange}
                        value={field.value}
                        error={errors.due_date?.message}
                      />
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      id="max_points"
                      type="number"
                      placeholder="100"
                      {...register("max_points", { valueAsNumber: true })}
                      className={`h-12 pl-12 text-sm ${errors.max_points ? "border-red-500 focus:border-red-500 bg-red-50 dark:bg-red-950/20" : "border-slate-200 focus:border-blue-500 bg-white dark:bg-slate-800"} transition-all duration-200 shadow-sm`}
                    />
                  </div>
                  {errors.max_points && (
                    <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {errors.max_points.message}
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload Requirement */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Label className="font-semibold text-slate-700 dark:text-slate-300">
                        Require File Upload
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Students must submit a file to complete this assignment
                      </p>
                    </div>
                  </div>
                  <Controller
                    name="requires_file"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="px-5 h-8 text-sm"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="px-5 h-8 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}