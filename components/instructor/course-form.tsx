"use client";

import { useState } from "react";
import { BookOpen, Loader, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FormData {
  title: string;
  description: string;
  price: string;
  duration: string;
  totalHours: string;
  category: string;
  level: "Bigginer" | "Intermediate" | "Advanced";
  status: "Active" | "Draft";
  institution: string;
  modules: string[];
}

export default function CourseForm() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    duration: "",
    totalHours: "",
    category: "",
    level: "Bigginer",
    status: "Draft",
    institution: "",
    modules: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({
          title: "❌ Failed",
          description: err.message || "Failed to create course.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "✅ Success",
          description: "Course created successfully!",
        });

        setFormData({
          title: "",
          description: "",
          price: "",
          duration: "",
          totalHours: "",
          category: "",
          level: "Bigginer",
          status: "Draft",
          institution: "",
          modules: [],
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "⚠️ Error",
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
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 8 weeks"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Total Hours */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Hours
          </label>
          <input
            type="text"
            name="totalHours"
            value={formData.totalHours}
            onChange={handleChange}
            placeholder="e.g. 40 hours"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="Bigginer">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Institution */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Institution ID *
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter institution ObjectId"
          />
        </div>

        {/* Modules */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Modules (comma-separated ObjectIds)
          </label>
          <input
            type="text"
            name="modules"
            value={formData.modules.join(",")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                modules: e.target.value
                  .split(",")
                  .map((id) => id.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="moduleId1,moduleId2"
          />
        </div>

        {/* Submit */}
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
