"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, Lock, User, Phone, UserPlus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    _id: " ",
    image: "",
    email: "",
    password: "",
    full_name: "",
    role: "student" as "student" | "institution",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value, files} = e.target
    
    if(name === 'image' && files &&files[0]){
      const file = files[0]
      const reader =  new FileReader()

      reader.onloadend = () =>{
        setFormData((prev)=> ({...prev, image: reader.result as string}))
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }else{
      setFormData((prev)=> ({...prev, [name]: value}))
    }
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <Card className="max-w-lg mx-auto bg-white border border-gray-200 shadow-xl">
        {/* Blue Header */}
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg space-y-6 text-center pb-4 pt-4">
          <div className="mx-auto w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlus className="h-4 w-4 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-light text-white">Join our platform</h2>
            <p className="text-blue-100 text-sm">Create your account to start learning</p>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-gray-700 text-sm font-medium">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 text-sm font-medium">Account Type</Label>
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
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="student" id="student" className="text-blue-500" />
                  <Label htmlFor="student" className="text-gray-700 font-medium cursor-pointer">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="institution" id="institution" className="text-blue-500" />
                  <Label htmlFor="institution" className="text-gray-700 font-medium cursor-pointer">
                    Institution
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 p-8 pt-2">
            {/* Blue Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Create account</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                  Sign in
                </Link>
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
