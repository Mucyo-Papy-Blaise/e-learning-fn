"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {  BookOpen, ChevronDown, Mail, MessageCircle, Facebook, Linkedin } from "lucide-react";
import { fetchCoursesByCategory, Course } from "@/lib/api/public";
import Image from 'next/image'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "outline" };
function Button({ children, variant = "solid", className = "", ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium focus:outline-none transition-colors";
  const styles = variant === "outline"
    ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
    : "bg-blue-600 text-white hover:bg-blue-700";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest} />
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white shadow-sm overflow-hidden ${className}`}>{children}</div>;
}

function useAuthStub() {
  const [isAuthenticated] = React.useState<boolean>(false);
  function openAuthModal() {
    alert("Please sign in to enroll.");
  }
  return { isAuthenticated, openAuthModal };
}

export default function CategoryPageClient() {
  const params = useParams() as { categoryName?: string } | undefined;
  const categoryName = params?.categoryName ?? "All";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("totalStudent");
  const [page, setPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCourses: 0, hasNext: false, hasPrev: false });

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({ category: true, price: true, difficulty: true });

  const { isAuthenticated, openAuthModal } = useAuthStub();

  useEffect(() => {
    loadCourses();
  }, [categoryName, sortBy, page]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetchCoursesByCategory(categoryName, 12, page, sortBy);
      setCourses(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(course.category || "")) {
      return false;
    }

    // Price filter
    if (selectedPriceRange) {
      const price = course.price || 0;
      if (selectedPriceRange === "free" && price !== 0) return false;
      if (selectedPriceRange === "0-20000" && (price < 0 || price > 20000)) return false;
      if (selectedPriceRange === "20000-50000" && (price < 20000 || price > 50000)) return false;
      if (selectedPriceRange === "50000+" && price < 50000) return false;
    }

    // Difficulty filter
    if (selectedDifficulty.length > 0 && !selectedDifficulty.includes(course.difficulty_level || "")) {
      return false;
    }

    return true;
  });

  function currencyFormat(amount?: number) {
    if (!amount || amount === 0) return "Free";
    return `${amount.toLocaleString()} RWF`;
  }

  function handleEnroll(courseId: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    console.log("Enroll in", courseId);
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty(prev =>
      prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const uniqueCategories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
  const uniqueDifficulties = Array.from(new Set(courses.map(c => c.difficulty_level).filter(Boolean)));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header with Gradient Background Image */}
      <div className="relative text-white py-16 md:py-24 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/study.jpg"
            alt="Academic background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {/* Blue to Transparent Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700/60 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-sm mb-2 opacity-90 font-medium text-white">Academics</p>
          <h1 className="text-5xl font-bold mb-6">Course List</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium mr-2">Share</span>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Mail className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
              <MessageCircle className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Facebook className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Linkedin className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-gray-50 border border-gray-200">
            <div className="bg-blue-600 text-white px-4 py-3 rounded">
              <h2 className="font-semibold text-white">Programs</h2>
            </div>

            {/* Category Filter */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("category")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 text-left"
              >
                <span className="font-medium text-sm">Filter by Category</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
              </button>
              {expandedSections.category && (
                <div className="px-4 pb-3 space-y-2">
                  {uniqueCategories.map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("price")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 text-left"
              >
                <span className="font-medium text-sm">Filter by Price</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
              </button>
              {expandedSections.price && (
                <div className="px-4 pb-3 space-y-2">
                  {["free", "0-20000", "20000-50000", "50000+"].map(range => (
                    <label key={range} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === range}
                        onChange={() => setSelectedPriceRange(range)}
                        className="border-gray-300"
                      />
                      <span className="text-sm">
                        {range === "free" ? "Free" :
                         range === "0-20000" ? "0 - 20,000 RWF" :
                         range === "20000-50000" ? "20,000 - 50,000 RWF" :
                         "50,000+ RWF"}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("difficulty")}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 text-left"
              >
                <span className="font-medium text-sm">Filter by Difficulty</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.difficulty ? 'rotate-180' : ''}`} />
              </button>
              {expandedSections.difficulty && (
                <div className="px-4 pb-3 space-y-2">
                  {uniqueDifficulties.map(difficulty => (
                    <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDifficulty.includes(difficulty)}
                        onChange={() => toggleDifficulty(difficulty)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{difficulty}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || selectedPriceRange || selectedDifficulty.length > 0) && (
              <div className="px-4 py-3">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedPriceRange("");
                    setSelectedDifficulty([]);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            {/* <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Filter course list by:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="border border-gray-300 px-3 py-1.5 text-sm"
              >
                <option value="totalStudent">PROFESSOR ▲</option>
                <option value="newest">NEWEST</option>
                <option value="price_low">PRICE: LOW TO HIGH</option>
                <option value="price_high">PRICE: HIGH TO LOW</option>
              </select>
              <select className="border border-gray-300 px-3 py-1.5 text-sm">
                <option>CREDITS ▲</option>
              </select>
            </div> */}

            {/* <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 border ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 border ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 ml-2">
                {viewMode === "grid" ? "GRID VIEW" : "LIST VIEW"}
              </span>
            </div> */}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 w-3/4" />
                    <div className="h-4 bg-gray-200 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="text-xl font-semibold mt-4">No courses found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course._id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700" />
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>NSP {course._id?.slice(-3).toUpperCase()}</span>
                        <span>{course.duration_weeks || 4} CREDITS</span>
                      </div>

                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600">
                        {course.title}
                      </h3>

                      <p className="text-xs text-gray-600 mb-3 uppercase">
                        {(course.institution && typeof course.institution === 'object' && course.institution.name) || 'INSTITUTION'}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-sm font-bold text-gray-900">{currencyFormat(course.price)}</div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/course/${course._id}`}>
                            <button className="text-base rounded  px-3 py-1 text-white font-semibold bg-blue-600 hover:bg-blue-400 cursor-pointer">View</button>
                          </Link>
                          <button onClick={() => handleEnroll(course._id)} className="text-base px-3 py-1 rounded shadow-sm border-b hover:text-blue-500">Enroll</button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {(pagination.hasNext || pagination.hasPrev) && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {Math.max(1, pagination.totalPages)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                    disabled={!pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}