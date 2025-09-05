"use client";

import { useState } from "react";
import { BookOpen, Loader, Award, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CourseFormState {
  title: string;
  description: string;
  price: string;
  category: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published";
  prerequisites: string;
  start_date: string;
  end_date: string;
  is_certified: boolean;
  duration_weeks: string;
}

export default function CourseForm() {
  const { toast } = useToast();

  const [formState, setFormState] = useState<CourseFormState>({
    title: "",
    description: "",
    price: "",
    category: "",
    difficulty_level: "beginner",
    status: "draft",
    prerequisites: "",
    start_date: "",
    end_date: "",
    is_certified: false,
    duration_weeks: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const body = new FormData();
      body.append("title", formState.title);
      body.append("description", formState.description);
      body.append("price", String(Number(formState.price) || 0));
      body.append("category", formState.category);
      body.append("difficulty_level", formState.difficulty_level);
      body.append("status", formState.status);
      if (formState.prerequisites.trim()) {
        // Backend expects prerequisites[]; send as JSON string or repeated field; use JSON string
        body.append("prerequisites", JSON.stringify(
          formState.prerequisites
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        ));
      }
      if (formState.start_date) body.append("start_date", formState.start_date);
      if (formState.end_date) body.append("end_date", formState.end_date);
      body.append("is_certified", String(Boolean(formState.is_certified)));
      body.append("duration_weeks", String(Number(formState.duration_weeks) || 0));
      if (thumbnailFile) body.append("thumbnail", thumbnailFile);

      const res = await fetch(`${API_URL}/api/courses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({
          title: "Failed",
          description: err.message || "Failed to create course.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Course created successfully!",
        });
        setFormState({
          title: "",
          description: "",
          price: "",
          category: "",
          difficulty_level: "beginner",
          status: "draft",
          prerequisites: "",
          start_date: "",
          end_date: "",
          is_certified: false,
          duration_weeks: "",
        });
        setThumbnailFile(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        Create Course
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formState.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="web, ui/ux, ..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              name="difficulty_level"
              value={formState.difficulty_level}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prerequisites (comma-separated)
          </label>
          <input
            type="text"
            name="prerequisites"
            value={formState.prerequisites}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="HTML, CSS, Basics of JS"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={formState.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              value={formState.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              id="is_certified"
              type="checkbox"
              name="is_certified"
              checked={formState.is_certified}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="is_certified" className="text-sm font-semibold text-gray-700">
              Certified Course
            </label>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration (weeks)
            </label>
            <input
              type="number"
              name="duration_weeks"
              value={formState.duration_weeks}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Thumbnail (optional)
          </label>
          <input type="file" accept="image/*" onChange={handleThumbnail} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Award className="w-5 h-5" />
              Create Course
            </>
          )}
        </button>
      </form>
    </div>
  );
}
