"use client"

import React, { useState, useMemo } from 'react';
import { Search, Users, MapPin, Globe, Twitter, Linkedin, Github, Plus, Edit } from 'lucide-react';
import AddInstructor from '@/components/addNewInstructor';

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

const initialInstructors: Instructor[] = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    title: "Digital Marketing Strategist",
    expertise: ["Digital Marketing", "Social Media", "Brand Strategy"],
    bio: "Former VP of Marketing at Fortune 500 companies with 15+ years of experience in digital transformation and brand building.",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "San Francisco, CA",
    rating: 4.9,
    students: 12500,
    social: {
      twitter: "@sarahmitchell",
      linkedin: "sarah-mitchell-marketing",
      website: "sarahmitchell.com"
    }
  },
  {
    id: 2,
    name: "Alex Chen",
    title: "Full Stack Developer",
    expertise: ["React", "Node.js", "Cloud Architecture"],
    bio: "Senior Software Engineer at Google with expertise in building scalable web applications and mentoring junior developers.",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "Seattle, WA",
    rating: 4.8,
    students: 8900,
    social: {
      github: "alexchen-dev",
      linkedin: "alex-chen-developer",
      twitter: "@alexchendev"
    }
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    title: "UX/UI Design Lead",
    expertise: ["User Experience", "Design Systems", "Prototyping"],
    bio: "Creative director with 10+ years at top design agencies, specializing in human-centered design and design thinking methodologies.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "New York, NY",
    rating: 4.9,
    students: 15200,
    social: {
      twitter: "@mariarodriguez",
      linkedin: "maria-rodriguez-design",
      website: "mariarodriguez.design"
    }
  },
];

const categories = ["All", "Business", "Tech", "Design"];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = useMemo(() => {
    return instructors.filter(instructor => {
      const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           instructor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           instructor.bio.toLowerCase().includes(searchTerm.toLowerCase());      
      return matchesSearch;
    });
  }, [searchTerm, selectedCategory, instructors]);

  const handleAddInstructor = (newInstructorData: any) => {
    if (editingInstructor) {
      // Update existing instructor
      setInstructors(prev => prev.map(instructor => 
        instructor.id === editingInstructor.id 
          ? { ...newInstructorData, id: editingInstructor.id }
          : instructor
      ));
      alert('Instructor updated successfully!');
    } else {
      // Add new instructor
      const newInstructor: Instructor = {
        ...newInstructorData,
        id: Math.max(...instructors.map(i => i.id)) + 1,
        rating: 4.5,
        students: 0,
      };
      setInstructors(prev => [...prev, newInstructor]);
      alert('Instructor added successfully!');
    }
    
    setCurrentView('list');
    setEditingInstructor(null);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setCurrentView('form');
  };

  const handleAddNew = () => {
    setEditingInstructor(null);
    setCurrentView('form');
  };

  if (currentView === 'form') {
    return (
      <AddInstructor
        onBack={() => {
          setCurrentView('list');
          setEditingInstructor(null);
        }}
        onSubmit={handleAddInstructor}
        editingInstructor={editingInstructor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900">
      {/* Header */}
      <header className="bg-blue-100 border-blue-200 shadow-lg border-b">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start md:items-center justify-between py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                EduPlatform
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full sm:w-64 lg:w-80 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Add Instructor Button */}
              <button
                onClick={handleAddNew}
                className="flex w-full items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Instructor</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-2 lg:px-8 py-3 lg:py-8">
        {/* Hero Section */}
        <div className="md:text-center text-start mb-4 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4 lg:mb-6 text-blue-600">
            Our Lectures
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 lg:gap-4 mb-8 lg:mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="group rounded overflow-hidden bg-white border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105"
            >
              {/* Instructor Image */}
              <div className="relative overflow-hidden">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  {/* <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-xs font-semibold text-blue-900">{instructor.rating}</span>
                  </div> */}
                  <button
                    onClick={() => handleEditInstructor(instructor)}
                    className="p-2 bg-blue-600/90 backdrop-blur-sm text-white rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {instructor.name}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">
                    {instructor.title}
                  </p>
                </div>

                <div className="flex items-center text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1 text-blue-400" />
                  <span className="text-blue-700">
                    {instructor.location}
                  </span>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {instructor.expertise.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {instructor.expertise.length > 3 && (
                    <span className="px-3 py-1 text-xs rounded-full font-medium text-blue-600">
                      +{instructor.expertise.length - 3}
                    </span>
                  )}
                </div>

                {/* Bio */}
                <p className="text-sm mb-4 line-clamp-3 leading-relaxed text-blue-700">
                  {instructor.bio}
                </p>

                {/* Stats */}
                {/* <div className="flex items-center justify-between mb-4 pt-3 border-t border-blue-200">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1 text-blue-400" />
                    <span className="text-blue-700">
                      {instructor.students.toLocaleString()}
                    </span>
                  </div>
                </div> */}

                {/* Social Links */}
                <div className="flex items-center justify-center space-x-4 pt-3 border-t border-blue-200">
                  {instructor.social.twitter && (
                    <a
                      href={`https://twitter.com/${instructor.social.twitter}`}
                      className="text-blue-400 hover:text-blue-600 transition-all duration-200 transform hover:scale-125"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {instructor.social.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${instructor.social.linkedin}`}
                      className="text-blue-400 hover:text-blue-600 transition-all duration-200 transform hover:scale-125"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {instructor.social.github && (
                    <a
                      href={`https://github.com/${instructor.social.github}`}
                      className="text-blue-400 hover:text-blue-600 transition-all duration-200 transform hover:scale-125"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {instructor.social.website && (
                    <a
                      href={`https://${instructor.social.website}`}
                      className="text-blue-400 hover:text-blue-600 transition-all duration-200 transform hover:scale-125"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredInstructors.length === 0 && (
          <div className="text-center py-16 lg:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-blue-100">
              <Users className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No instructors found</h3>
            <p className="text-blue-700">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;