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
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-6"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fill in the details below to create an engaging and comprehensive
            course for your students.
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-slate-200 shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Course Title */}
              <div className="space-y-3">
                <label
                  htmlFor="title"
                  className="flex items-center text-base font-semibold text-gray-800"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Course Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter an engaging course title"
                  {...form.register("title")}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm font-medium">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label
                  htmlFor="description"
                  className="flex items-center text-base font-semibold text-gray-800"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Course Description
                </label>

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <TiptapEditor
                      name={field.name}
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Describe what students will learn in this course..."
                      className="bg-white border border-gray-300 rounded-lg"
                    />
                  )}
                />

                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm font-medium">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Price and Difficulty Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label
                    htmlFor="price"
                    className="flex items-center text-base font-semibold text-gray-800"
                  >
                    Price (RWF)
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="10000"
                    {...form.register("price")}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                  />
                  {form.formState.errors.price && (
                    <p className="text-red-500 text-sm font-medium">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="difficulty_level"
                    className="flex items-center text-base font-semibold text-gray-800"
                  >
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty_level"
                    {...form.register("difficulty_level")}
                    className="w-full h-14 px-4 border-2 border-gray-200 rounded-lg text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {form.formState.errors.difficulty_level && (
                    <p className="text-red-500 text-sm font-medium">
                      {form.formState.errors.difficulty_level.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <label
                  htmlFor="duration_weeks"
                  className="flex items-center text-base font-semibold text-gray-800"
                >
                  Duration (in weeks)
                </label>
                <input
                  type="number"
                  id="duration_weeks"
                  placeholder="Enter duration in weeks"
                  {...form.register("duration_weeks")}
                  style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                  className="no-spinner w-full h-14 px-4 border-2 border-gray-200 rounded-lg text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                />
                {form.formState.errors.duration_weeks && (
                  <p className="text-red-500 text-sm font-medium">
                    {form.formState.errors.duration_weeks.message}
                  </p>
                )}
              </div>

              {/* Certification Checkbox */}
              {/* <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="is_certified"
                    {...form.register("is_certified")}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="is_certified"
                    className="flex items-center text-lg font-medium text-gray-800"
                  >
                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                    This course provides certification upon completion
                  </label>
                </div>
              </div> */}

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <label
                  htmlFor="thumbnail"
                  className="flex items-center text-base font-semibold text-gray-800"
                >
                  <Upload className="h-4 w-4 mr-2 text-indigo-600" />
                  Course Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-blue-400 transition-colors duration-200">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    {...form.register("thumbnail")}
                    className="w-full text-lg file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                  />
                  <p className="text-gray-500 mt-2">
                    Upload a high-quality image for your course
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className={`w-full flex  text-center h-16 hover:bg-blue-700 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] ${
                    create ? "bg-blue-400" : "bg-blue-600"
                  }`}
                >
                  {create ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
