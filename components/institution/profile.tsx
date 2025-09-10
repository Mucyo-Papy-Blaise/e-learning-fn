"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  getMyInstitutionProfile,
  updateMyInstitutionProfile,
} from "@/lib/api/institution";
import type { InstitutionProfileResponse } from "@/types/institution";
import CompanyInfo from "./institutionInfo";
import SecuritySettings from "./institutionSecurity";

export default function InstitutionProfile() {
  const [personalData, setPersonalData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setProfileImage(URL.createObjectURL(selectedFile));
    }
  };

  // Fetch institution profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res: InstitutionProfileResponse = await getMyInstitutionProfile();
        const institution = res?.institution;

        if (institution) {
          setPersonalData((prev) => ({
            ...prev,
            name: institution.name || "",
            email: institution.contact_email || "",
            phone: institution.contact_phone || "",
            bio: institution.bio || "",
          }));

          if (institution.logo) setProfileImage(institution.logo);
        }
      } catch (e) {
        toast.error("Failed to load institution profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Save updated profile
  const handleSave = async () => {
    if (
      personalData.password &&
      personalData.password !== personalData.confirmPassword
    ) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const form = new FormData();

      if (file) form.append("logo", file);
      if (personalData.name) form.append("name", personalData.name);
      if (personalData.bio) form.append("bio", personalData.bio);
      if (personalData.phone) form.append("contact_phone", personalData.phone);
      if (personalData.email) form.append("contact_email", personalData.email);
      if (personalData.password) form.append("password", personalData.password);

      await updateMyInstitutionProfile(form);
      toast.success("Profile updated successfully!");
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Institution Profile</h2>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 rounded-xl bg-gray-100">
          <TabsTrigger value="info">Company Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <CompanyInfo
            personalData={personalData}
            profileImage={profileImage}
            onChange={handleChange}
            onFileChange={handleFileChange}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings
            personalData={personalData}
            onChange={handleChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="mt-4 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>

        <Link
          href="/institution/instructors/new"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add New Instructor
        </Link>
      </div>
    </div>
  );
}
