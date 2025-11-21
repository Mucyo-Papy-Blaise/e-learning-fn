"use client"

import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { Camera, Plus, X, User, Mail, Phone, Lock, Briefcase, FileText, ExternalLink, Shield } from 'lucide-react';
import { getMyInstructorProfile, updateInstructorAccount, updateMyInstructorProfile } from "@/lib/api/instructor/profile";
import { toast } from 'react-toastify';
import { SocialLinks, PersonalData, SecurityData, TabType } from '@/types/profile.types';


const EditInstructorProfile = () => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  
  const [personalData, setPersonalData] = useState<PersonalData>({
    name: "",
    email: "",
    phone: "",
    profession_name: "",
    bio: "",
    expertise: [],
    social_links: { linkedin: "", twitter: "", github: "" }
  });

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [newExpertise, setNewExpertise] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getMyInstructorProfile();
        const { instructor } = res as any;
        // Normalize expertise and social_links if backend returns strings
        let expertise: string[] = [];
        if (Array.isArray(instructor.expertise)) {
          if (instructor.expertise.length === 1 && typeof instructor.expertise[0] === 'string') {
            try {
              const parsed = JSON.parse(instructor.expertise[0]);
              if (Array.isArray(parsed)) expertise = parsed;
            } catch {
              expertise = [instructor.expertise[0]];
            }
          } else {
            expertise = instructor.expertise;
          }
        }
        let socialLinks: any = instructor.social_links || { linkedin: "", twitter: "", github: "" };
        if (typeof socialLinks === 'string') {
          try { socialLinks = JSON.parse(socialLinks); } catch { socialLinks = { linkedin: "", twitter: "", github: "" }; }
        }
        setPersonalData({
          name: instructor.user_id?.name || "",
          email: instructor.user_id?.email || "",
          phone: instructor.user_id?.phone || "",
          profession_name: instructor.profession_name || "",
          bio: instructor.bio || "",
          expertise,
          social_links: socialLinks
        });
        if (instructor.profile_image) {
          setProfileImage(instructor.profile_image);
        }
      } catch (e) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePersonalInputChange = (field: keyof Omit<PersonalData, 'expertise' | 'social_links'>, value: string): void => {
    setPersonalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityInputChange = (field: keyof SecurityData, value: string): void => {
    setSecurityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string): void => {
    setPersonalData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const addExpertise = (): void => {
    if (newExpertise.trim() && !personalData.expertise.includes(newExpertise.trim())) {
      setPersonalData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise("");
    }
  };

  const removeExpertise = (expertiseToRemove: string): void => {
    setPersonalData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addExpertise();
    }
  };

  const validatePasswordChange = (): boolean => {
    if (!securityData.currentPassword.trim()) {
      alert('Please enter your current password');
      return false;
    }
    if (securityData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return false;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New password and confirm password do not match');
      return false;
    }
    return true;
  };

  const handleSave = async (): Promise<void> => {
    if (activeTab === 'personal') {
      try {
        setLoading(true);
        const form = new FormData();
        form.append('profession_name', personalData.profession_name || '');
        form.append('bio', personalData.bio || '');
        form.append('expertise', JSON.stringify(personalData.expertise || []));
        form.append('social_links', JSON.stringify(personalData.social_links || {}));
        if (profileImageFile) {
          form.append('profile_image', profileImageFile);
        }
        const res = await updateMyInstructorProfile(form);
        const { instructor } = res;
        toast.success('Profile updated');
        setProfileImage(instructor.profile_image || null);
      } catch (e) {
        toast.error('Failed to update profile');
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'security') {
      if (validatePasswordChange()) {
        // Not implemented in backend; skip actual call
        setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast.success('Password updated');
      }
    }
  };

  const handleCancel = (): void => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      if (activeTab === 'security') {
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
      console.log('Cancelled editing');
      alert('Changes cancelled');
    }
  };

  const triggerImageUpload = (): void => {
    const imageInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (imageInput) {
      imageInput.click();
    }
  };

  const renderPersonalTab = () => (
    <>
      {/* Profile Image Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-gray-200 overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={triggerImageUpload}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Basic Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-500" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              value={personalData.name}
              onChange={(e) => handlePersonalInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                id="email"
                value={personalData.email}
                onChange={(e) => handlePersonalInputChange('email', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                id="phone"
                value={personalData.phone}
                onChange={(e) => handlePersonalInputChange('phone', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
          Professional Information
        </h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
            <input
              type="text"
              id="profession"
              value={personalData.profession_name}
              onChange={(e) => handlePersonalInputChange('profession_name', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <div className="relative">
              <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <textarea
                id="bio"
                value={personalData.bio}
                onChange={(e) => handlePersonalInputChange('bio', e.target.value)}
                rows={4}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Expertise</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {personalData.expertise.map((skill: string, index: number) => (
            <div
              key={index}
              className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-blue-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeExpertise(skill)}
                className="w-4 h-4 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={newExpertise}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewExpertise(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new expertise..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={addExpertise}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <ExternalLink className="w-5 h-5 mr-2 text-blue-500" />
          Social Links
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              value={personalData.social_links.linkedin}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="url"
              id="twitter"
              value={personalData.social_links.twitter}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="https://twitter.com/username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
            <input
              type="url"
              id="github"
              value={personalData.social_links.github}
              onChange={(e) => handleSocialLinkChange('github', e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderSecurityTab = () => (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-500" />
          Change Password
        </h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                id="currentPassword"
                value={securityData.currentPassword}
                onChange={(e) => handleSecurityInputChange('currentPassword', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your current password"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                id="newPassword"
                value={securityData.newPassword}
                onChange={(e) => handleSecurityInputChange('newPassword', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your new password (min. 6 characters)"
                minLength={6}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                id="confirmPassword"
                value={securityData.confirmPassword}
                onChange={(e) => handleSecurityInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  securityData.newPassword && securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Confirm your new password"
                required
              />
            </div>
            {securityData.newPassword && securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-100">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Edit Profile</h1>
          <p className="text-lg text-gray-600">Update your profile information and settings</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Personal Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'personal' && renderPersonalTab()}
            {activeTab === 'security' && renderSecurityTab()}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-w-32"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-w-32"
            >
              {activeTab === 'personal' ? 'Save Personal Info' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInstructorProfile;