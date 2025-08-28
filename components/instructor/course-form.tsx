"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCourses } from "@/lib/hooks/use-courses";
import {
  BookOpen,
  Upload,
  DollarSign,
  Clock,
  Award,
  FileText,
  Loader,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import TiptapEditor from "../ui/TipTap.Editor";
import { Controller } from "react-hook-form";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]),
  duration_weeks: z.string().min(1, "Duration is required"),
  is_certified: z.boolean().default(false),
  thumbnail: z.any().default(null),
});

export const CourseForm = () => {
  const [step, setStep] = useState<number>(1)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      difficulty_level: "beginner",
      duration_weeks: "",
      is_certified: false,
      thumbnail: null,
    },
  });

  const { createCourse } = useCourses();
  const [create, setIsCreating] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating(true);
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("difficulty_level", values.difficulty_level);
      formData.append("duration_weeks", values.duration_weeks);
      formData.append("is_certified", String(values.is_certified));

      if (values.thumbnail && values.thumbnail[0]) {
        formData.append("thumbnail", values.thumbnail[0]);
      }

      await createCourse(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--brand-light)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[color:var(--brand-navy)]">Create a Course</h1>
          <p className="text-sm text-gray-600">Step {step} of 4</p>
        </div>
        <Card className="bg-white border border-gray-200">
          <div className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Course title</label>
                    <input {...form.register("title")} className="w-full h-11 px-3 border border-gray-300 rounded-md" placeholder="e.g. Fullstack Development" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Controller control={form.control} name="description" render={({ field }) => (
                      <TiptapEditor name={field.name} content={field.value} onChange={field.onChange} placeholder="What will learners achieve?" className="bg-white border border-gray-300 rounded-md" />
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Price</label>
                      <input type="number" {...form.register("price")} className="w-full h-11 px-3 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Difficulty</label>
                      <select {...form.register("difficulty_level")} className="w-full h-11 px-3 border border-gray-300 rounded-md bg-white">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Duration (weeks)</label>
                      <input type="number" {...form.register("duration_weeks")} className="w-full h-11 px-3 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Thumbnail</label>
                    <input type="file" accept="image/*" {...form.register("thumbnail")} className="w-full" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Next you will add modules to structure your course.</p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Then add lessons for each module.</p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Finally, create assignments to assess learners.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button type="button" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="px-4 h-10 border border-gray-300 rounded-md text-sm disabled:opacity-50">Back</button>
                {step < 4 ? (
                  <button type="button" onClick={() => setStep((s) => Math.min(4, s + 1))} className="px-4 h-10 rounded-md text-sm text-white" style={{ backgroundColor: 'var(--brand-blue)' }}>Continue</button>
                ) : (
                  <button type="submit" className={`px-4 h-10 rounded-md text-sm text-white ${create ? 'opacity-70' : ''}`} style={{ backgroundColor: 'var(--brand-blue)' }}>
                    {create ? 'Creating…' : 'Create Course'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
