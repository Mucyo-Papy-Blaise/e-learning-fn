"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus, User, Mail, MapPin, Globe, Twitter, Linkedin, Github } from 'lucide-react';

interface InstructorFormData {
  name: string;
  title: string;
  email: string;
  location: string;
  bio: string;
  expertise: string[];
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

interface Instructor {
  id: number;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  image: string;
  location: string;
  rating: number;
  students: number;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

interface AddInstructorProps {
  onBack: () => void;
  onSubmit: (instructor: InstructorFormData) => void;
  editingInstructor?: Instructor | null;
}

const categories = ["Business", "Tech", "Design"];

const AddInstructor: React.FC<AddInstructorProps> = ({ onBack, onSubmit, editingInstructor }) => {
  const [formData, setFormData] = useState<InstructorFormData>({
    name: '',
    title: '',
    email: '',
    location: '',
    bio: '',
    expertise: [],
    image: '',
    social: {}
  });
  const [newSkill, setNewSkill] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (editingInstructor) {
      setFormData({
        name: editingInstructor.name,
        title: editingInstructor.title,
        email: '', // Email not in original data, keep empty
        location: editingInstructor.location,
        bio: editingInstructor.bio,
        expertise: editingInstructor.expertise,
        image: editingInstructor.image,
        social: editingInstructor.social
      });
      setImagePreview(editingInstructor.image);
    }
  }, [editingInstructor]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!editingInstructor && !formData.email.trim()) newErrors.email = 'Email is required';
    else if (!editingInstructor && formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.expertise.length === 0) newErrors.expertise = 'At least one skill is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    else if (formData.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof InstructorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [platform]: value }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.expertise.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(s => s !== skill)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900">
      {/* Header */}
      <header className="bg-blue-100 border-blue-200 shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-blue-700 hover:text-blue-900 hover:bg-blue-200 transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Instructors</span>
            </button>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
              {editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Form Content */}
        <div className="bg-white border border-blue-200 shadow-2xl rounded-2xl p-6 lg:p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-blue-600">
                {editingInstructor ? 'Edit Information' : 'Instructor Information'}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Professional Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {!editingInstructor && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="instructor@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.location ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="City, Country"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Expertise Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-600">Areas of Expertise</h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a skill or expertise area"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.expertise && <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>}
            </div>

            {/* Bio Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Professional Biography *</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.bio ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Write a compelling biography that highlights your experience, achievements, and what makes you a great instructor..."
              />
              <div className="flex justify-between items-center mt-2">
                {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                <p className={`text-sm ml-auto ${
                  formData.bio.length < 50 ? 'text-red-500' : 'text-blue-600'
                }`}>
                  {formData.bio.length}/50 minimum characters
                </p>
              </div>
            </div>

            {/* Profile Photo Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Profile Photo</label>
              <div className="border-2 border-dashed border-blue-300 hover:border-blue-400 bg-blue-50/20 rounded-xl p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 font-medium"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-blue-500" />
                    <div>
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Upload a photo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm mt-1 text-blue-600">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-600">Social Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <span>Twitter Username</span>
                  </label>
                  <input
                    type="text"
                    value={formData.social.twitter || ''}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                    <span>LinkedIn Profile</span>
                  </label>
                  <input
                    type="text"
                    value={formData.social.linkedin || ''}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <Github className="h-4 w-4 text-blue-600" />
                    <span>GitHub Profile</span>
                  </label>
                  <input
                    type="text"
                    value={formData.social.github || ''}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="github.com/username"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span>Personal Website</span>
                  </label>
                  <input
                    type="text"
                    value={formData.social.website || ''}
                    onChange={(e) => handleSocialChange('website', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="www.yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-blue-200">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
              >
                {editingInstructor ? 'Update Instructor' : 'Add Instructor'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddInstructor;