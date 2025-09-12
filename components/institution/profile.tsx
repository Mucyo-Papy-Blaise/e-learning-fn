"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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
    bio: "",
    location: "",
    website: "",
    email: "",
    phone: "",
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
        const res: any = await getMyInstitutionProfile();
        const institution = res?.institution || res?.data;

        if (institution) {
          setPersonalData((prev) => ({
            ...prev,
            name: institution.name || "",
            bio: institution.bio || "",
            location: institution.location || "",
            website: institution.website || "",
            email: institution.contact_email || "",
            phone: institution.contact_phone || "",
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
    try {
      const form = new FormData();

      if (file) form.append("logo", file);
      if (personalData.name !== undefined) form.append("name", personalData.name);
      if (personalData.bio !== undefined) form.append("bio", personalData.bio);
      if (personalData.location !== undefined) form.append("location", personalData.location);
      if (personalData.website !== undefined) form.append("website", personalData.website);
      if (personalData.phone !== undefined) form.append("contact_phone", personalData.phone);
      if (personalData.email !== undefined) form.append("contact_email", personalData.email);

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

      <Button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
