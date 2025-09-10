"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleList } from "./modules/module-list";
import { ModuleForm } from "./modules/module-form";
import { Button } from "@/components/ui/button";
import {
  Plus,
  BookOpen,
  Settings,
  FileText,
  GraduationCap,
  Edit3,
  Trash2,
  Rocket,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCourses } from "@/lib/hooks/use-courses";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

export const CourseDetails = ({ courseId }: { courseId: string }) => {
  const [activeTab, setActiveTab] = useState("modules");
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const {
    currentCourse,
    modules,
    loadCourse,
    loadModules,
    isLoading,
    updateCourse,
    deleteCourse,
    publishCourse,
  } = useCourses();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, setEditState] = useState<{
    title: string;
    description: string;
    price: string;
    category: string;
    difficulty_level: "beginner" | "intermediate" | "advanced";
  } | null>(null);

  useEffect(() => {
    loadCourse(courseId);
    loadModules(courseId);
  }, [courseId]);

  if (isLoading || !currentCourse) {
    return (
      <div className="space-y-6 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-80 bg-gray-100 rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-md">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
              {currentCourse.title}
            </h1>
            <div
              className="text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: currentCourse.description || "",
              }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <Card className="p-4 bg-white border shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
          <Button
            onClick={() => setIsAddModuleOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-md"
          >
            <Plus className="h-4 w-4" /> Module
          </Button>
          <Button
            onClick={() => {
              setEditState({
                title: currentCourse.title,
                description: currentCourse.description || "",
                price: String(currentCourse.price ?? ""),
                category: currentCourse.category || "",
                difficulty_level: currentCourse.difficulty_level,
              });
              setIsEditOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-md"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </Button>
          <Button
            onClick={async () => {
              const confirmed = window.confirm(
                "Delete this course? This cannot be undone."
              );
              if (!confirmed) return;
              const ok = await deleteCourse(courseId);
              if (ok) router.push("/instructor/courses");
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-md"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button
            onClick={async () => {
              await publishCourse(courseId);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-md"
          >
            <Rocket className="h-4 w-4" /> Publish
          </Button>
          <a href={`/instructor/exams/new?courseId=${courseId}`}>
            <Button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full h-9 rounded-md">
              <GraduationCap className="h-4 w-4" /> Exam
            </Button>
          </a>
          <a href={`/instructor/assignments?courseId=${courseId}`}>
            <Button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full h-9 rounded-md">
              <FileText className="h-4 w-4" /> Assignments
            </Button>
          </a>
        </div>
      </Card>

      {/* Add Module Dialog */}
      <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <ModuleForm
            courseId={courseId}
            onSuccess={() => setIsAddModuleOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editState && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateCourse(courseId, {
                  title: editState.title,
                  description: editState.description,
                  price: Number(editState.price) || 0,
                  category: editState.category,
                  difficulty_level: editState.difficulty_level,
                } as any);
                setIsEditOpen(false);
              }}
              className="space-y-3 text-sm"
            >
              <div>
                <label className="block mb-1">Title</label>
                <input
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={editState.title}
                  onChange={(e) =>
                    setEditState({ ...(editState as any), title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={editState.description}
                  onChange={(e) =>
                    setEditState({
                      ...(editState as any),
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1">Price</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={editState.price}
                    onChange={(e) =>
                      setEditState({
                        ...(editState as any),
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={editState.category}
                    onChange={(e) =>
                      setEditState({
                        ...(editState as any),
                        category: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">Difficulty</label>
                  <select
                    className="w-full border rounded px-2 py-1 text-sm bg-white"
                    value={editState.difficulty_level}
                    onChange={(e) =>
                      setEditState({
                        ...(editState as any),
                        difficulty_level: e.target.value as any,
                      })
                    }
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-blue-600 text-white">
                  Save
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Card className="bg-white border shadow-sm rounded-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-gray-50 border-b px-3 py-2">
            <TabsList className="flex gap-2 bg-white rounded-md">
              <TabsTrigger
                value="modules"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
              >
                <FileText className="h-4 w-4" />
                Modules
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
              >
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="p-4">
            <TabsContent value="modules">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <h2 className="text-base font-semibold text-gray-800">
                    Course Modules
                  </h2>
                </div>
                <ModuleList modules={modules} courseId={courseId} />
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="text-center py-6 text-gray-500 text-sm">
                <Settings className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                Course settings coming soon.
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};
