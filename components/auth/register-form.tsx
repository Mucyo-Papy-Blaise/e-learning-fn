"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Upload, X } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    _id: " ",
    image: "",
    email: "",
    password: "",
    name: "",
    role: "student" as "student" | "institution",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await register(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    
    if (name === 'image' && files && files[0]) {
      const file = files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }))
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
    setPreviewImage(null)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
        <p className="text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 ml-1 underline">
            Sign in here
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Upload */}
        {/* <div className="space-y-2">
          <Label className="text-slate-300 text-sm font-medium">
            Profile Picture (Optional)
          </Label>
          <div className="flex items-center space-x-4">
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-600 flex items-center justify-center">
                <Upload className="h-6 w-6 text-slate-400" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Label>
            </div>
          </div>
        </div> */}

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300 text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
              required
            />
            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
              required
            />
            <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-300 text-sm font-medium">
            Phone Number
          </Label>
          <div className="relative">
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
              required
            />
            <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Account Type */}
        <div className="space-y-3">
          <Label className="text-slate-300 text-sm font-medium">Account Type</Label>
          <RadioGroup
            defaultValue="student"
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                role: value as "student" | "institution",
              }))
            }
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-3 p-4 bg-slate-800/30 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
              <RadioGroupItem value="student" id="student" className="text-blue-500 border-slate-500" />
              <Label htmlFor="student" className="text-slate-300 font-medium cursor-pointer">
                Student
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-slate-800/30 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
              <RadioGroupItem value="institution" id="institution" className="text-blue-500 border-slate-500" />
              <Label htmlFor="institution" className="text-slate-300 font-medium cursor-pointer">
                Institution
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group border-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-slate-400 bg-slate-900">Or</span>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center text-sm mt-6">
          <span className="text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}