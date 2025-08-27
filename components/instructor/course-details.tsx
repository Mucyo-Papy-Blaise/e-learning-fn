"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleList } from "./modules/module-list";
import { ModuleForm } from "./modules/module-form";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Settings, FileText, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCourses } from "@/lib/hooks/use-courses";
import { Card } from "@/components/ui/card";

export const CourseDetails = ({ courseId }: { courseId: string }) => {
  const [activeTab, setActiveTab] = useState("modules");
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const { currentCourse, modules, loadCourse, loadModules, isLoading } = useCourses();

  useEffect(() => {
    loadCourse(courseId);
    loadModules(courseId);
  }, [courseId]);

  if (isLoading || !currentCourse) {
    return (
      <div className="space-y-8 p-1 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-10 w-80 bg-gray-200 rounded-lg" />
            <div className="h-5 w-96 bg-gray-100 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
        <Card className="p-8 bg-white border shadow-lg">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-32 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 md:p-6">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex md:flex-row flex-col items-center space-x-1 md:space-x-3">
              <div className="p-2 bg-blue-600 md:block  rounded-lg hidden items-center justify-center shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentCourse.title}
                </h1>
                <p className="text-gray-600 text-lg mt-2 leading-relaxed pose">
                  <div dangerouslySetInnerHTML={{ __html: currentCourse.description || '' }} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={() => setIsAddModuleOpen(true)}
            className="flex-1 sm:flex-none h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Module
          </Button>
          
          <a 
            href={`/instructor/courses/${courseId}/exam`} 
            className="flex-1 sm:flex-none"
          >
            <Button className="w-full h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <GraduationCap className="mr-2 h-5 w-5" />
              Add Exam
            </Button>
          </a>
        </div>
      </div>

      {/* Dialog for Add Module */}
      <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="space-y-3">
          </DialogHeader>
          <ModuleForm
            courseId={courseId}
            onSuccess={() => setIsAddModuleOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Tabs Section */}
      <Card className="bg-white border shadow-lg rounded-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="bg-gray-50 border-b px-2 md:px-6 py-4">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:flex lg:space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <TabsTrigger 
                value="modules" 
                className="flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Modules</span>
                <span className="sm:hidden">Modules</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center space-x-2 px-0 md:px-4 py-3 rounded-md font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Course Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="modules" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Course Modules</h2>
                </div>
                <ModuleList modules={modules} courseId={courseId} />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Course Settings</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Settings Coming Soon</h3>
                  <p className="text-gray-500">Course settings and configuration options will be available here.</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};
