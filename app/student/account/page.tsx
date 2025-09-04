"use client";

import { useState, useEffect } from "react";
import { User, Settings, Shield } from "lucide-react";
import AccountOverview from "@/components/student/accountOverview";
import ProfileSettings from "@/components/student/profileSettings";
import Security from "@/components/student/securitySettings";
import { getMyStudentProfile } from "@/lib/api/student";

function formatStudentData(student: any) {
  return {
    name: student.user_id?.name || "",
    email: student.user_id?.email || "",
    phone: student.user_id?.phone || "",
    bio: student.bio || "",
    gender: student.gender || "",
    dateOfBirth: student.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().split("T")[0]
      : "",
    paymentStatus: student.paymentStatus || "pending",
    joinedDate: student.joinedDate || "",
    isActive: student.is_active,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
    profileImage: student.profile_image, // ✅ profile image comes from backend
  };
}

const StudentAccountSettings = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getMyStudentProfile();
        const formatted = formatStudentData(res.student);
        setStudentProfile(formatted);
      } catch (err) {
        console.error("Failed to load student profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const tabs = [
    { id: "overview", label: "Account Overview", icon: User },
    { id: "profile", label: "Profile Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        // @ts-expect-error error
        return <AccountOverview studentData={studentProfile} />;
      case "profile":
        return (
          <ProfileSettings
        // @ts-expect-error error
            studentData={studentProfile}
            setStudentData={setStudentProfile}
          />
        );
      case "security":
        return <Security />;
      default:
        // @ts-expect-error error
        return <AccountOverview studentData={studentProfile} />;
    }
  };

  if (loading && !studentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {studentProfile?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={studentProfile.profileImage}
                  alt={studentProfile.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Account Settings
              </h1>
              <p className="text-gray-600">
                Manage your profile and account preferences
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">{renderActiveTab()}</div>
      </div>
    </div>
  );
};

export default StudentAccountSettings;
