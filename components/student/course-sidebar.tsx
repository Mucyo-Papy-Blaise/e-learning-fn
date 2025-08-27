import { ChevronLast } from "lucide-react";
import React from "react";

const navItems = [
  { key: "home", label: "Home" },
  { key: "announcements", label: "Announcements" },
  { key: "assignments", label: "Assignments" },
  { key: "modules", label: "Modules" },
  { key: "pages", label: "Pages" },
  { key: "files", label: "Files " },
  { key: "chat", label: "Chat" },
  // { key: "groups", label: "Groups" },
  { key: "grades", label: "Grades" },
];

type CourseSidebarProps = {
  course: {
    title: string;
  };
  active: string;
  onNavChange: (key: string) => void;
  onBack: () => void;
};

export default function CourseSidebar({
  course,
  active,
  onNavChange,
  onBack,
}: CourseSidebarProps) {
  return (
    <div className="bg-white border-r border-gray-200 shadow-sm w-56 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-900">{course.title}</h2>
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLast />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavChange(item.key)}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              active === item.key
                ? "bg-blue-100 text-blue-900 font-semibold"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
